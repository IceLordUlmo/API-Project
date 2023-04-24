// backend/routes/api/users.js

// create the router, import bcrypt
const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Group, Membership, GroupImage, Venue, Event } = require('../../db/models');
const router = express.Router();
const { Op } = require('sequelize');
// import express validator and function to validate request bodies
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

// get all groups
router.get('/', async (req, res, next) => {
    const allGroups = await Group.findAll({
        attributes: ["id",
            "organizerId",
            "name",
            "about",
            "type",
            "private",
            "city",
            "state",
            "createdAt",
            "updatedAt"]
    });

    for (let group of allGroups) {
        const groupId = group.id;

        const memberCount = await Membership.count({
            where: {
                groupId: groupId
            }
        });

        group.dataValues.numMembers = memberCount;

        const preview = await GroupImage.findOne({
            where: {
                groupId: groupId,
                preview: true
            }
        });

        group.dataValues.previewImage = preview ? preview.url : null;
    }

    objectifyAllGroups = {
        Groups: allGroups
    }

    return res.json(objectifyAllGroups);
})

// get all groups joined or organized by currentuser

router.get('/current', requireAuth, async (req, res) => {
    const userId = req.user.id;
    const organizedGroups = await Group.findAll({
        attributes: ["id", "organizerId", "name", "about", "type", "private", "city", "state", "createdAt", "updatedAt"],
        where: {
            organizerId: userId
        }
    })

    const allMembershipGroups = await Membership.findAll({
        attributes: ['id', 'userId', 'groupId'],
        where: {
            userId: userId
        },
        include: {
            model: Group
        }
    });

    // combine membership groups with organized groups
    for (let membership of allMembershipGroups) {
        organizedGroups.push(membership.Group);
    }

    for (let group of organizedGroups) {
        const id = group.id;
        const membershipCount = await Membership.count({
            where: {
                groupId: id
            }
        });
        // counted the members, add it to the data object
        group.dataValues.numMembers = membershipCount

        // get the image
        const groupImage = await GroupImage.findOne({
            where: {
                groupId: id,
                preview: true
            },
            attributes: ['url']
        })

        group.dataValues.previewImage = (groupImage) ? groupImage.url : ''
    }

    const objectifyCurrentGroups = {
        "Groups": organizedGroups
    }

    return res.json(objectifyCurrentGroups);
})

// get group details by id

router.get('/:groupId', async (req, res, next) => {
    const { groupId } = req.params;

    // for readability
    const groupIdRequested = groupId;

    const groupById = await Group.findByPk(groupIdRequested, {
        include: [{
            model: GroupImage,
            attributes: ["id", "url", "preview"]
        },
        {
            model: User,
            as: "Organizer",
            attributes: ["id", "firstName", "lastName"]
        },
        {
            model: Venue,
            attributes: ["id", "groupId", "address", "city", "state", "lat", "lng"]
        }
        ],
    });

    if (!groupById) {
        res.status(404);
        return res.json({ "message": "Group couldn't be found" })
    }

    let memberCount = await Membership.count({
        where: {
            groupId: groupIdRequested
        }
    })

    groupById.dataValues.numMembers = memberCount;

    return res.json(groupById)

})

// create a group

router.post("/", requireAuth, async (req, res) => {
    const { name, about, type, private, city, state } = req.body;
    const organizerId = req.user.id;

    // make an object containing all relevant errors
    let errorList = {};

    let errorFlag = false;

    if (name.length > 60) {
        errorList.name = "Name must be 60 characters or less"
        errorFlag = true;
    }
    if (about.length < 50) {
        errorList.about = "About must be 50 characters or more"
        errorFlag = true;
    }
    if (type != 'Online' && type != 'In person') {
        errorList.type = "Type must be 'Online' or 'In person'"
        errorFlag = true;
    }
    if (typeof private != 'boolean') {
        errorList.private = "Private must be a boolean"
        errorFlag = true;
    }
    if (!city) {
        errorList.city = "City is required"
        errorFlag = true;
    }
    if (!state) {
        errorList.state = "State is required"
        errorFlag = true;
    }

    if (errorFlag) {
        res.status(400)
        return res.json({
            "message": "Bad Request",
            errorList
        })
    }

    const groupToAdd = await Group.create({
        organizerId: organizerId,
        name: name,
        about: about,
        type: type,
        private: private,
        city: city,
        state: state
    })

    res.status(201);
    return res.json(groupToAdd);
})

// add image to group based on groupId

router.post('/:groupId/images', requireAuth, async (req, res) => {
    const { url, preview } = req.body;

    const { groupId } = req.params;

    const groupToAddImageTo = await Group.findOne({
        where: {
            id: groupId
        }
    })

    if (!groupToAddImageTo) {
        res.status(404)
        return res.json({ 'message': "Group couldn't be found" })
    }

    let currentUserId = req.user.id
    let organizerId = groupToAddImageTo.organizerId

    if (currentUserId != organizerId) {
        let error = { 'message': 'Current User must be the organizer of the group or a member of the group with a status of "co-host"' }
        res.status(403);
        return res.json(error)
    }

    const newGroupImage = await GroupImage.create({ groupId, url, preview })

    const objectifiedImage = {
        id: newGroupImage.id,
        url: newGroupImage.url,
        preview: newGroupImage.preview
    }

    return res.json(objectifiedImage)
})

// edit a group
router.put('/:groupId', requireAuth, async (req, res) => {
    const { name, about, type, private, city, state } = req.body;
    const { groupId } = req.params;

    // make an object containing all relevant errors
    let errorList = {};

    let errorFlag = false;

    if (name.length > 60) {
        errorList.name = "Name must be 60 characters or less"
        errorFlag = true;
    }
    if (about.length < 50) {
        errorList.about = "About must be 50 characters or more"
        errorFlag = true;
    }
    if (type != 'Online' && type != 'In person') {
        errorList.type = "Type must be 'Online' or 'In person'"
        errorFlag = true;
    }
    if (typeof private != 'boolean') {
        errorList.private = "Private must be a boolean"
        errorFlag = true;
    }
    if (!city) {
        errorList.city = "City is required"
        errorFlag = true;
    }
    if (!state) {
        errorList.state = "State is required"
        errorFlag = true;
    }

    if (errorFlag) {
        res.status(400)
        return res.json({
            "message": "Bad Request",
            errorList
        })
    }

    const groupToEdit = await Group.findOne({
        where: {
            id: groupId
        }
    });

    if (!groupToEdit) {
        res.status(404);
        return res.json({ 'message': "Group couldn't be found" })
    }

    let currentUserId = req.user.id
    let organizerId = groupToEdit.organizerId

    if (currentUserId != organizerId) {
        let error = { 'message': 'Current User must be the organizer of the group or a member of the group with a status of "co-host"' }
        res.status(403);
        return res.json(error)
    }

    await groupToEdit.update({
        name: name,
        about: about,
        type: type,
        private: private,
        city: city,
        state: state
    })

    return (res.json(groupToEdit))
})

// delete a group

router.delete('/:groupId', requireAuth, async (req, res) => {
    const { groupId } = req.params;
    const groupToBeDeleted = await Group.findOne({
        where: {
            id: groupId
        }
    })

    if (!groupToBeDeleted) {
        res.status(404);
        return res.json({ 'message': "Group couldn't be found" })
    }

    let currentUserId = req.user.id
    let organizerId = groupToBeDeleted.organizerId

    if (currentUserId != organizerId) {
        let error = { 'message': 'Current User must be the organizer of the group or a member of the group with a status of "co-host"' }
        res.status(403);
        return res.json(error)
    }

    groupToBeDeleted.destroy();
    const objectifyDeletion = { 'message': 'Successfully deleted' }
    return res.json(objectifyDeletion)
})

// get all venues for a group by groupId

router.get("/:groupId/venues", requireAuth, async (req, res) => {
    const { groupId } = req.params;
    const requestedGroup = await Group.findOne({
        where: {
            id: groupId
        }
    });

    if (!requestedGroup) {
        res.status(404);
        return res.json({ 'message': "Group couldn't be found" })
    };

    const cohostMemberships = await Membership.findAll({
        where: {
            userId: req.user.id,
            status: "co-host"
        }
    })

    const cohostedGroups = cohostMemberships.map(membership => { return membership.groupId })

    let currentUserId = req.user.id
    let organizerId = requestedGroup.organizerId

    if (currentUserId != organizerId) {
        if (!cohostedGroups.includes(groupId)) {
            let error = { 'message': 'Current User must be the organizer of the group or a member of the group with a status of "co-host"' }
            res.status(403);
            return res.json(error)
        }
    }

    //we get this far, we're the organizer or the cohost and we found the group, lets go

    const venuesOfGroup = await Venue.findAll({
        where: {
            groupId: groupId
        },
        attributes: ["id", "groupId", "address", "city", "state", "lat", "lng"]
    })

    objectifyVenues = { 'Venues': venuesOfGroup }

    return res.json(objectifyVenues);
})


// create new venue by groupId

router.post('/:groupId/venues', requireAuth, async (req, res) => {
    const { address, city, state, lat, lng } = req.body;
    const { groupId } = req.params;

    let errorFlag = false;
    const errorList = {};
    if (!address) {
        errorList.address = 'Street address is required';
        errorFlag = true;
    }
    if (!city) {
        errorList.city = 'City is required';
        errorFlag = true;
    }
    if (!state) {
        errorList.state = "State is required";
        errorFlag = true;
    }
    if (isNaN(lat)) {
        errorList.lat = 'Latitude is not valid'
        errorFlag = true;
    }
    if (isNaN(lng)) {
        errorList.lng = 'Longitude is not valid'
        errorFlag = true;
    }

    if (errorFlag) {
        res.status(400)
        return res.json({
            "message": "Bad Request",
            errorList
        })
    }

    const requestedGroup = await Group.findOne({
        where: {
            id: groupId
        }
    })

    if (!requestedGroup) {
        res.status(404)
        return res.json(
            {
                "message": "Group couldn't be found"
            }
        )
    }

    const cohostMemberships = await Membership.findAll({
        where: {
            userId: req.user.id,
            status: "co-host"
        }
    })

    const cohostedGroups = cohostMemberships.map(membership => { return membership.groupId })

    let currentUserId = req.user.id
    let organizerId = requestedGroup.organizerId

    if (currentUserId != organizerId) {
        if (!cohostedGroups.includes(groupId)) {
            let error = { 'message': 'Current User must be the organizer of the group or a member of the group with a status of "co-host"' }
            res.status(403);
            return res.json(error)
        }
    }

    const newVenue = await Venue.create({
        groupId: groupId,
        address: address,
        city: city,
        state: state,
        lat: lat,
        lng: lng
    });

    objectifyVenue = {
        id: newVenue.id,
        groupId: newVenue.groupId,
        address: newVenue.address,
        city: newVenue.city,
        state: newVenue.state,
        lat: newVenue.lat,
        lng: newVenue.lng
    }

    return res.json(objectifyVenue);
})


// get all events from a group by groupId
router.get('/:groupId/events', async (req, res) => {
    const { groupId } = req.params;
    const requestedGroupId = groupId;
    const requestedGroup = await Group.findAll({
        where: {
            id: requestedGroupId
        }
    });

    if (requestedGroup.length === 0) {
        // didn't find the group
        res.status(404)
        return res.json(
            {
                'message': "Group couldn't be found"
            })
    }

    const groupEvents = await Event.findAll({
        where: {
            groupId: requestedGroupId
        },
        attributes: ["id", "groupId", "venueId", "name", "type", "startDate", "endDate"],
        include: [
            {
                model: Venue,
                attributes: ["id", "city", "state"]
            },
            {
                model: Group,
                attributes: ["id", "name", "city", "state"]
            }
        ]
    })

    if (groupEvents.length === 0) {
        res.status(404);
        return res.json(
            {
                'message': "No events found for group"
            })
    }

    for (let event of groupEvents) {
        // attach the image
        const eventImage = await EventImage.findOne({
            where: {
                eventId: eventId,
                preview: true
            }
        })
        event.dataValues.previewImage = eventImage ? eventImage.url : null;

        // attach the attendance count
        let eventId = event.id
        const attendanceCount = await Attendance.count({
            where: {
                eventId: eventId
            }
        })
        event.dataValues.numAttending = attendanceCount;
    }

    const objectifyGroupEvents = { 'Events': groupEvents }

    return res.json(objectifyGroupEvents);
})



// create an event for a group by groupId
router.post("/:groupId/events", requireAuth, async (req, res) => {
    const { groupId } = req.params;
    const requestedGroupId = groupId;
    const userId = req.user.id;
    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;

    const destinationGroup = await Group.findOne({
        where: { id: requestedGroupId }
    })

    if (!destinationGroup) {
        res.status(404)
        return res.json(
            {
                'message': "Group couldn't be found"
            }
        )
    }

    const cohostMembershipOfTheUser = await Membership.findOne({
        where: {
            groupId: requestedGroupId,
            status: "co-host",
            userId: userId
        }
    })

    let organizerId = destinationGroup.organizerId;

    // if there's no cohost membership and we're not the organizer
    if (!cohostMembershipOfTheUser &&
        organizerId !== userId) {
        let error = { 'message': 'Current User must be the organizer of the group or a member of the group with a status of "co-host"' }
        res.status(403);
        return res.json(error)
    }

    let venueLookup = await Venue.findOne({
        where: {
            id: venueId
        }
    })

    let errorList = {};
    let errorFlag = false;
    let now = new Date();

    if (!venueLookup) {
        errorList.venueId = "Venue does not exist"
        errorFlag = true;
    }
    const startDateComparable = new Date(startDate).toDateString();
    const endDateComparable = new Date(endDate).toDateString();
    if (now > startDateComparable) {
        errorList.startDate = "Start date must be in the future"
        errorFlag = true;
    }
    if (startDateComparable > endDateComparable) {
        errorList.endDate = "End date is less than start date"
        errorFlag = true;
    }
    if (name.length < 5) {
        errorList.name = "Name must be at least 5 characters"
        errorFlag = true;
    }
    if (type !== "Online" && type !== "In person") {
        errorList.type = "Type must be Online or In person"
        errorFlag = true;
    }
    if (!Number.isInteger(capacity)) {
        errorList.capacity = "Capacity must be an integer"
        errorFlag = true;
    }
    if (typeof price !== 'number') {
        errorList.price = "Price is invalid"
        errorFlag = true;
    }
    if (!description) {
        errorList.description = "Description is required"
        errorFlag = true;
    }

    if (errorFlag) {
        res.status(400)
        return res.json({
            "message": "Bad Request",
            errorList
        })
    }

    const createdEvent = await Event.create({
        venueId,
        groupId,
        name,
        description,
        type,
        capacity,
        price,
        startDate,
        endDate
    })

    res.status(200)

    objectifyCreatedEvent = {
        id: createdEvent.dataValues.id,
        groupId: createdEvent.dataValues.groupId,
        venueId: createdEvent.dataValues.venueId,
        name: createdEvent.dataValues.name,
        type: createdEvent.dataValues.type,
        capacity: createdEvent.dataValues.capacity,
        price: createdEvent.dataValues.price,
        description: createdEvent.dataValues.description,
        startDate: createdEvent.dataValues.startDate,
        endDate: createdEvent.dataValues.endDate
    }

    return res.json()
})

router.get("/:groupId/members", async (req, res) => {
    const { groupId } = req.params;
    const userId = req.user.id;
    const groupIdToGetMembersOf = groupId
    const groupToGetMembersOf = await Group.findOne({
        where: {
            id: groupIdToGetMembersOf
        }
    });

    if (!groupToGetMembersOf) {
        res.status(404);
        return res.json(
            {
                message: "Group couldn't be found"
            }
        )
    };

    // not quite 403 forbidden

    // everyone can see these
    const statusesAuthorizedToSee = ['organizer', 'co-host', 'member'];

    const cohostMembership = await Membership.findOne({
        where: {
            userId: userId,
            groupId: groupId,
            status: "co-host"
        }
    })

    // if we are a co-host or the organizer, add pending visibility as well
    if (cohostMembership ||
        groupToGetMembersOf.organizerId === userId) {
        statusesAuthorizedToSee.push('pending')
    }

    const membershipsOfGroup = await Membership.findAll({
        where: {
            groupId: groupId
        },
        include: {
            model: User,
            where: {
                status: statusesAuthorizedToSee
            }
        }
    })

    const memberArray = []
    for (membership of membershipsOfGroup) {
        const membershipInfo = {};
        membershipInfo.id = membership.User.id;
        membershipInfo.firstName = membership.User.firstName;
        membershipInfo.lastName = membership.User.lastName;
        membershipInfo.Membership = {
            status: membership.status
        }

        memberArray.push(membershipInfo);
    }

    objectifyMemberList =
    {
        Members: memberArray
    }

    return res.json(objectifyMemberList);
})

// request a membership for a group by groupId
router.post("/:groupId/membership", requireAuth, async (req, res) => {
    const { groupId } = req.params;
    const groupIdRequestingMembershipFor = groupId;
    const userId = req.user.id;

    const groupRequestingMembershipFor = await Group.findOne({
        where:
        {
            id: groupIdRequestingMembershipFor
        }
    })

    if (!groupRequestingMembershipFor) {
        res.status(404)
        return res.json(
            {
                message: "Group couldn't be found"
            }
        )
    }

    const userMembership = await Membership.findOne(
        {
            where:
            {
                groupId: groupId,
                userId: userId
            }
        }
    )

    // if we already have one pending
    if (userMembership.status == "pending") {
        res.status(400)
        return res.json(
            {
                message: 'Membership has already been requested'
            }
        )
    }

    // if we're already in
    if (userMembership.status == "member" ||
        userMembership.status == "co-host" ||
        userMembership.status == "organizer") {
        res.status(400)
        return res.json(
            {
                message: 'User is already a member of the group'
            }
        )
    }

    const newMembership = await Membership.create({
        userId,
        groupId,
        status: 'pending'
    })

    objectifyNewMembership =
    {
        memberId: userId,
        status: 'pending'
    }

    return res.json(objectifyNewMembership)
})

// Change the status of a membership for a group by groupId

router.put('/:groupId/membership', requireAuth, async (req, res) => {
    const { memberId, status } = req.body;
    const { groupId } = req.params;
    const groupIdChangingMembershipOf = groupId;
    const memberIdToChange = memberId;
    const userId = req.user.id;

    const groupChangingMembershipOf = await Group.findOne({
        where: {
            id: groupIdChangingMembershipOf
        }
    })

    if (status == 'pending') {
        res.status(400)
        return res.json(
            {
                "message": "Validations Error",
                "errors": {
                    "status": "Cannot change a membership status to pending"
                }
            }
        )
    }

    if (!groupChangingMembershipOf) {
        res.status(404)
        return res.json(
            {
                message: "Group couldn't be found"
            }
        )
    }

    // 403 forbidden

    const cohostMembershipOfTheUser = await Membership.findOne({
        where: {
            groupId: groupIdChangingMembershipOf,
            status: "co-host",
            userId: userId
        }
    })

    let organizerId = groupChangingMembershipOf.organizerId;
    let isOrganizer = (organizerId == userId);

    // if there's no cohost membership and we're not the organizer
    if (!isOrganizer) {
        if (!cohostMembershipOfTheUser) {
            let error = { 'message': 'Current User must be the organizer of the group or a member of the group with a status of "co-host"' }
            res.status(403);
            return res.json(error)
        }

        if (status == 'co-host') {
            let error = { 'message': 'To change the status from "member" to "co-host, Current User must already be the organizer' }
            res.status(403);
            return res.json(error)
        }
    }

    // find the user and the membership
    const userToChange = await User.findOne(
        {
            where: {
                id: memberIdToChange
            }
        }
    )

    const membershipToChange = await Membership.findOne(
        {
            where: {
                groupId: groupIdChangingMembershipOf,
                userId: memberIdToChange
            }
        }
    )

    // see if they exist
    if (!userToChange) {
        res.status(400);
        return res.json({
            "message": "Validation Error",
            "errors": {
                "memberId": "User couldn't be found"
            }
        })
    }

    if (!membershipToChange) {
        res.status(404);
        return res.json({
            "message": "Membership between the user and the group does not exist"
        })
    }

})


// delete a membership by groupId and memberId
router.delete("/:groupId/membership", requireAuth, async (req, res) => {
    const userId = req.user.id;
    const { memberId } = req.body;
    const { groupId } = req.params;
    const groupIdToDeleteFrom = groupId;
    const memberIdToDeleteFrom = memberId;
    const groupToDeleteFrom = await Group.findOne({
        where:
        {
            id: groupIdToDeleteFrom
        }
    })
    const userToDeleteFrom = await User.findOne(
        {
            where: {
                id: memberIdToDeleteFrom
            }
        }
    )
    const membershipToDelete = await Membership.findOne({
        where: {
            userId: memberId,
            groupId: groupIdToDeleteFrom
        }
    })

    // see if they exist
    if (!groupToDeleteFrom) {
        res.status(404)
        return res.json(
            {
                message: "Group couldn't be found"
            }
        )
    }

    if (!userToDeleteFrom) {
        res.status(400)
        return res.json(
            {
                "message": "Validation Error",
                "errors": {
                    "memberId": "User couldn't be found"
                }
            }
        )
    }

    if (!membershipToDelete) {
        res.status(404)
        return res.json(
            {
                "message": "Membership does not exist for this User"
            }
        )
    }

    let isCurrentUser = (memberIdToDeleteFrom == userId)
    let isOrganizer = (groupToDeleteFrom.organizerId == userId)

    if (!isCurrentUser && !isOrganizer) {
        // 403 forbidden
        let error = { 'message': 'Current User must be the host of the group, or the user whose membership is being deleted' }
        res.status(403);
        return res.json(error)
    }

    // this is where the magic happens
    await Membership.destroy({
        where: {
            id: membershipToDelete.id
        }
    })

    objectifyDelete = {
        message: 'Successfully deleted membership from group'
    }

    return res.json(objectifyDelete);
})

// export it
module.exports = router;
//
