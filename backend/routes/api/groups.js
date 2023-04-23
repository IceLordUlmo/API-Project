// backend/routes/api/users.js

// create the router, import bcrypt
const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const router = express.Router();

// import express validator and function to validate request bodies
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const Group = require('../../db/models/group');
const Membership = require('../../db/models/membership');
const GroupImage = require('../../db/models/groupimage');
const Venue = require('../../db/models/venue');
const membership = require('../../db/models/membership');


function AddMemberCountAndPreviewImage(groups) {

}

// get all groups
router.get('/', async (req, res, next) => {
    const allGroups = await Group.findAll({
        include: [{
            model: Membership, attributes: ['id']
        }, {
            model: GroupImage, attributes: ['url'],
            where: {
                preview: true
            }
        }]
    })

    for (let group of allGroups) {
        group.dataValues.numMembers = group.dataValues.Memberships.length;
        Reflect.deleteProperty(group.dataValues, 'Memberships');

        group.dataValues.previewImage = group.dataValues.GroupImages[0].url;
        Reflect.deleteProperty(group.dataValues, 'GroupImages');
    }

    // turn it into an object to be returned per spec
    let objectifyAllGroups = { "Groups": allGroups };

    res.json(objectifyAllGroups)
})

// get all groups joined or organized by currentuser

router.get('/current', requireAuth, async (req, res) => {
    const currentGroups = await Group.findall({
        attributes: ["id", "organizerId", "name", "about", "type", "private", "city", "state", "createdAt", "updatedAt"],
        where: {
            organizerId: req.user.id
        }
    })

    const allMembershipGroups = await Membership.findAll({
        attributes: ['id', 'userId', 'groupId'],
        where: {
            userId: req.user.id
        },
        include: {
            model: Group
        }
    });

    // make an array of all the groups
    const membGroupArray = allMembershipGroups.map(membershipGroup => {
        return membership.dataValues.Group
    })

    // if we found more to add, smush them
    if (membGroupArray.length > 1) {
        currentGroups.concat(membGroupArray);
    }

    for (let group of allMembershipGroups) {
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
        "Groups": allMembershipGroups
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
    if (name.about > 60) {
        errorList.about = "About must be 50 characters or more"
        errorFlag = true;
    }
    if (type > 60) {
        errorList.type = "Type must be 'Online' or 'In person'"
        errorFlag = true;
    }
    if (private > 60) {
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
    return res.json(newGroup);
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

    if (!group) {
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
    if (name.about > 60) {
        errorList.about = "About must be 50 characters or more"
        errorFlag = true;
    }
    if (type > 60) {
        errorList.type = "Type must be 'Online' or 'In person'"
        errorFlag = true;
    }
    if (private > 60) {
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
        let error = { 'message': 'Forbidden' }
        res.status(403);
        return res.json(error)
    }

    groupToEdit.update({
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
    if (type !== "Online" && type !== "In Person") {
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


// export it
module.exports = router;
