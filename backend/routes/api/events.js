// backend/routes/api/users.js

// create the router, import bcrypt
const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Attendance, Event, EventImage, Group, Membership, User, Venue } = require('../../db/models');
const router = express.Router();

// import express validator and function to validate request bodies
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


// get all events

router.get('/', async (req, res, next) => {

    let { name, type, startDate, page, size } = req.query;
    const errorList = {};
    const where = {};
    const pagination = {};

    let errorFlag = false;

    page = parseInt(page);
    size = parseInt(size);

    page = Number.isInteger(page) ? page : 1
    size = Number.isInteger(size) ? size : 20;

    if (page < 1) {
        errorList.page = "Page must be greater than or equal to 1";
        errorFlag = true;
    }
    if (size < 1) {
        errorList.size = "Size must be greater than or equal to 1";
        errorFlag = true;
    }
    if (startDate && !Number.isInteger(Date.parse(startDate))) {
        errorList.startDate = "Start date must be in date format";
        errorFlag = true;
    }
    if (type && type !== 'Online' && type !== 'In person') {
        errorList.type = "Type must be 'Online' or 'In person'";
        errorFlag = true;
    }
    if (name && typeof name !== 'string') {
        errorList.name = "Name has to be a string";
        errorFlag = true;
    }

    if (errorFlag) {
        res.status(400)
        return res.json({
            "message": "Bad Request",
            errorList
        })
    }

    if (page > 10) {
        page = 10;
    }
    if (size > 20) {
        size = 20;
    }
    pagination.limit = size;
    pagination.offset = size * (page - 1);


    if (startDate) {
        where.startDate = new Date(startDate);
    }

    if (name) {
        where.name = name;
    }

    if (type) {
        where.type = type;
    }

    const allEvents = await Event.findAll({
        where,
        ...pagination,
        attributes: ["id", "groupId", "venueId", "name", "type", "startDate", "endDate"],
        include: [{
            model: Venue,
            attributes: ["id", "city", "state"]
        },
        {
            model: Group,
            attributes: ["id", "name", "city", "state"]
        }
        ]
    })

    for (let event of allEvents) {

        const eventId = event.id;

        // add the preview image
        const previewImage = await EventImage.findOne({
            where: {
                eventId: eventId,
                preview: true
            }
        })

        if (!previewImage) {
            event.dataValues.previewImage = null;
        }
        else {
            event.dataValues.previewImage = previewImage.url;
        }

        // and the attendance count
        const attendanceCount = await Attendance.count({
            where: {
                eventId: eventId
            }
        })

        event.dataValues.numAttending = attendanceCount;
    }

    objectifyAllEvents = { 'Events': allEvents }

    return res.json(objectifyAllEvents);
})

// get event details by eventId

router.get("/:eventId", async (req, res) => {
    const { eventId } = req.params;
    const requestedEventId = eventId;
    const requestedEvent = await Event.findOne({
        where: {
            id: requestedEventId
        },
        include: [{
            model: Group,
            attributes: ["id", "name", "private", "city", "state"]
        },
        {
            model: EventImage,
            attributes: ["id", "url", "preview"]
        }, {
            model: Venue,
            attributes: ["id", "address", "city", "state", "lat", "lng"]
        }
        ],
        attributes: ["id", "groupId", "venueId", "name", "description", "type", "capacity", "price", "startDate", "endDate"]
    })

    if (!requestedEvent) {
        res.status(404)
        res.json(
            {
                'message': "Event couldn't be found"
            }
        )
    }

    let attendanceCount = await Attendance.count({ where: { eventId: requestedEventId } })

    requestedEvent.dataValues.numAttending = attendanceCount;

    objectifyEvent = requestedEvent; // I guess we don't need to do this but it's for consistency

    return res.json(objectifyEvent);
})

// add an image to an event by its eventId
router.post("/:eventId/images", requireAuth, async (req, res) => {
    const { eventId } = req.params;
    const { url, preview } = req.body;
    const userId = req.user.id;
    const eventToAddTo = await Event.findOne({
        where: {
            id: eventId
        },
        include: {
            model: Group
        }
    })

    if (!eventToAddTo) {
        res.status(404);

        return res.json(
            {
                'message': "Event couldn't be found"
            }
        )
    }

    // 403 forbidden goes here
    const groupForAddedImage = await Group.findOne({
        where: {
            id: eventToAddTo.groupId
        },
        include: {
            model: Event
        }
    })

    const cohostMembershipOfTheUser = await Membership.findOne({
        where: {
            groupId: groupForAddedImage.id,
            status: "co-host",
            userId: userId
        }
    })

    let organizerId = groupForAddedImage.organizerId;

    // if there's no cohost membership and we're not the organizer
    if (!cohostMembershipOfTheUser &&
        organizerId !== userId) {
        let error = { 'message': 'Current User must be the organizer of the group or a member of the group with a status of "co-host"' }
        res.status(403);
        return res.json(error)
    }


    const imageToAdd = await EventImage.create({
        eventId: eventId,
        url: url,
        preview: preview
    })

    const objectifyNewImage = {
        id: imageToAdd.id,
        url: imageToAdd.url,
        preview: imageToAdd.preview
    }

    return res.json(objectifyNewImage);
})

// edit event by eventId

router.put("/:eventId", requireAuth, async (req, res) => {
    const { eventId } = req.params;
    const userId = req.user.id;
    const eventIdToEdit = eventId;
    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;
    const eventToEdit = await Event.findOne({
        where: {
            id: eventIdToEdit
        },
        include: {
            model: Group,
            attributes: ["id", "organizerId"]
        }
    })

    if (!eventToEdit) {
        res.status(404);
        return res.json(
            {
                'message': "Event couldn't be found"
            }
        )
    }

    //403 forbidden
    const groupForEditedEvent = await Group.findOne({
        where: {
            id: eventToEdit.groupId
        }
    })

    const cohostMembershipOfTheUser = await Membership.findOne({
        where: {
            groupId: groupForEditedEvent.id,
            status: "co-host",
            userId: userId
        }
    })

    let organizerId = groupForEditedEvent.organizerId;

    // if there's no cohost membership and we're not the organizer
    if (!cohostMembershipOfTheUser &&
        organizerId !== userId) {
        let error = { 'message': 'Current User must be the organizer of the group or a member of the group with a status of "co-host"' }
        res.status(403);
        return res.json(error)
    }


    let now = Date.now();
    const startDateString = new Date(startDate).toDateString();
    const endDateString = new Date(endDate).toDateString();
    const errorList = {};
    let errorFlag = false;


    const venueFinder = await Venue.findOne({
        where: {
            id: venueId
        }
    })
    if (!venueId || !Number.isInteger(venueId) || venueFinder) {
        errorList.venueId = "Venue does not exist";
        errorFlag = true;
    }

    if (!name || name.length < 5) {
        errorList.name = "Name must be at least 5 characters";
        errorFlag = true;
    }
    if (type !== "Online" && type !== "In person") {
        errorList.type = "Type must be Online or In person";
        errorFlag = true;
    }
    if (!Number.isInteger(capacity)) {
        errorList.capacity = "Capacity must be an integer";
        errorFlag = true;
    }
    if (!description) {
        errorList.description = "Description is required";
        errorFlag = true;
    }
    if (now > (new Date(startDate).getTime())) {
        errorList.startDate = "Start date must be in the future";
        errorFlag = true;
    }
    if (startDateString > endDateString) {
        errorList.endDate = "End date is less than start date";
        errorFlag = true;
    }
    if (!price || price < 0 || isNaN(price)) {
        errorList.price = "Price is invalid";
        errorFlag = true;
    }


    //errorflag
    if (errorFlag) {
        res.status(400)
        return res.json({
            "message": "Bad Request",
            errorList
        })
    }

    // don't just see if the numbers exist, see if the venue is real
    const venue = await Venue.findByPk(venueId);

    if (!venue) {
        res.status(404)
        return res.json({
            "message": "Venue couldn't be found",
            errorList
        })
    }

    eventToEdit.update({
        venueId,
        name,
        type,
        capacity,
        price,
        description,
        startDate,
        endDate
    })


    objectifyEditedEvent =
    {
        id: eventToEdit.id,
        groupId: eventToEdit.Group.id,
        venueId: eventToEdit.venueId,
        name: eventToEdit.name,
        type: eventToEdit.type,
        capacity: eventToEdit.capacity,
        price: eventToEdit.price,
        description: eventToEdit.description,
        startDate: eventToEdit.startDate,
        endDate: eventToEdit.endDate
    }

    res.json(objectifyEditedEvent)
})

// delete event specified by eventId
router.delete("/:eventId", requireAuth, async (req, res) => {
    const { eventId } = req.params;
    const userId = req.user.id;
    const eventIdToBeDeleted = eventId;

    const eventToDelete = await Event.findOne({
        where: {
            id: eventIdToBeDeleted
        },
        include: {
            model: Group,
            attributes: ['id', 'organizerId']
        }
    })

    if (!eventToDelete) {
        res.status(404);
        return res.json(
            {
                message: "Event couldn't be found"
            }
        )
    }

    //403 forbidden
    const groupForDeletedEvent = await Group.findOne({
        where: {
            id: eventToDelete.Group.id
        },
        attributes: ['organizerId']
    })

    const cohostMembershipOfTheUser = await Membership.findOne({
        where: {
            groupId: groupForDeletedEvent.id,
            status: "co-host",
            userId: userId
        }
    })

    let organizerId = groupForDeletedEvent.organizerId;

    // if there's no cohost membership and we're not the organizer
    if (!cohostMembershipOfTheUser &&
        organizerId !== userId) {
        let error = { 'message': 'Current User must be the organizer of the group or a member of the group with a status of "co-host"' }
        res.status(403);
        return res.json(error)
    }

    await Event.destroy(
        {
            where: {
                id: eventIdToBeDeleted
            }
        }
    )

    objectifyDeletion = {
        message: 'Successfully deleted'
    }

    return res.json(objectifyDeletion)
})


// get all attendees of an event by eventId

router.get("/:eventId/attendees", async (req, res) => {

    const { eventId } = req.params;
    const userId = req.user ? req.user.id : null; // hope this works if we're not logged in
    const statusesAuthorizedToSee = ['organizer', 'co-host', 'member'];

    const eventAttended = await Event.findOne({
        where:
        {
            id: eventId
        },
        include:
        {
            model: Group
        }
    })

    if (!eventAttended) {
        res.status(404);
        return res.json(
            {
                message: "Event couldn't be found"
            }
        )
    }



    const cohostMembership = await Membership.findOne({
        where: {
            userId: userId,
            groupId: eventAttended.group.id,
            status: "co-host"
        }
    })

    // if we are a co-host or the organizer, add pending visibility as well
    if (cohostMembership ||
        groupToGetMembersOf.organizerId === userId) {
        statusesAuthorizedToSee.push('pending')
    }

    const attendeesOfEvent = await Attendance.findAll({
        where: {
            eventId: eventId

        },
        include: {
            model: User,
            where: {
                status: statusesAuthorizedToSee
            }
        }
    })

    const attendeeArray = []
    for (attendee of attendeesOfEvent) {
        const attendeeInfo = {};
        attendeeInfo.id = attendee.User.id;
        attendeeInfo.firstName = attendee.User.firstName;
        attendeeInfo.lastName = attendee.User.lastName;
        attendeeInfo.Attendance = {
            status: attendee.status
        }

        attendeeArray.push(attendeeInfo);
    }

    objectifyAttendeeArray = {
        Attendees: attendeeInfo
    }

    return res.json(objectifyAttendeeArray)
})

// request to attend an event based on eventId

router.post("/:eventId/attendance", requireAuth, async (req, res) => {
    const userId = req.user.id;
    const { eventId } = req.params;
    const eventIdBeingRequested = eventId;

    const eventBeingRequested = await Event.findOne(
        {
            where: {
                id: eventIdBeingRequested
            }
        }
    )

    if (!eventBeingRequested) {
        res.status(404);
        return res.json(
            {
                message: "Event couldn't be found"
            }
        )
    }

    const authorizedMembership = await Membership.findOne(
        {
            where: {
                groupId: eventBeingRequested.Group.id,
                userId: userId,
                status: ['organizer', 'co-host', 'member']
            }
        }
    )

    if (!authorizedMembership) {
        let error = { 'message': 'Current User must be a member of the group' }
        res.status(403);
        return res.json(error)
    }

    const eventAttendance = await Attendance.findOne({
        where: {
            eventId: eventIdBeingRequested,
            userId: userId
        }
    })



    // if we already have an entry
    if (eventAttendance) {
        const attendanceStatus = eventAttendance.status;
        if (attendanceStatus == 'pending') {
            res.status(400);
            return res.json(
                {
                    "message": "Attendance has already been requested"
                }
            )
        }
        else {
            return res.json(
                {
                    "message": "User is already an attendee of the event"
                }
            )
        }
    }

    // here we go
    const attendance = await Attendance.create({
        userId,
        eventId,
        status: 'pending'
    })

    objectifyNewAttendance = {
        userId: attendance.userId,
        status: attendance.status
    }

    return res.json(objectifyNewAttendance)
})

// change the status of an attendance specified by eventId and userId

router.put(':eventId/attendance', requireAuth, async (req, res) => {
    const loggedInUserId = req.user.id;
    const { eventId } = req.params;
    const { userId, status } = req.body;
    const userIdToChangeAttendanceOf = userId;

    if (status == 'pending') {
        res.status(400)
        return res.json(
            {
                "status": "Cannot change an attendance status to pending"
            }

        )
    }

    const eventToAlter = await Event.findOne({
        where: {
            id: eventId
        },
        include: {
            model: Group,
            attributes: ['id', 'organizerId']
        }
    })

    if (!eventToAlter) {
        res.status(404);
        return res.json(
            {
                message: "Event couldn't be found"
            }
        )
    }

    const attendanceCohostMembership = await Membership.findOne(
        {
            where: {
                groupId: eventToAlter.Group.id,
                userId: loggedInUserId,
                status: 'co-host'
            }
        }
    )

    let isCoHost = (attendanceCohostMembership) ? true : false;
    let isOrganizer = (groupToDeleteFrom.organizerId == userId)

    if (!isCoHost && !isOrganizer) {
        // 403 forbidden
        let error = { 'message': 'Current User must already be the organizer or have a membership to the group with the status of "co-host"' }
        res.status(403);
        return res.json(error)
    }

    const attendingUser = await User.findOne(
        {
            where: {
                id: userIdToChangeAttendanceOf
            }
        }
    )

    if (!attendingUser) {
        res.status(400);
        return res.json(
            {
                "message": "Validation Error",
                "errors": {
                    "memberId": "User couldn't be found"
                }
            }
        )
    }

    const attendanceToChange = await Attendance.findOne({
        where: {
            eventId: eventId,
            userId: userIdToChangeAttendanceOf
        }
    })

    if (!attendanceToChange) {
        res.status(404)
        return res.json(
            {
                "message": "Attendance between the user and the event does not exist"
            }
        )
    }

    // hey witch doctor give me the magic words:

    attendanceToChange.update(
        {
            status: status
        }
    )

    const objectifyAttendanceChange =
    {
        id: attendanceToChange.id,
        eventId: attendanceToChange.eventId,
        userId: attendanceToChange.userId,
        status: attendanceToChange.status
    }
    // feel like I'm going to do an ObiWan next week, "who wrote all this verbose nonsense" "of course I know him, he's me"
    return res.json(objectifyAttendanceChange)
})

// delete attendance to an event specified by eventId and userId

router.delete('/:eventId/attendance', requireAuth, async (req, res) => {
    const { eventId } = req.params;
    const { userId } = req.body;
    const userIdToUseForDeletion = userId;
    const loggedInUserId = req.user.id;
    const eventThatHasTheAttendanceToDelete = await Event.findOne(
        {
            where: {
                id: eventId
            },
            include: {
                model: Group,
                attributes: ['id', 'organizerId']
            }

        }
    )

    if (!eventThatHasTheAttendanceToDelete) {
        res.status(404);
        return res.json(
            {
                message: "Event couldn't be found"
            }
        )
    }

    let isCurrentUser = (userIdToUseForDeletion == loggedInUserId)
    let isOrganizer = (eventThatHasTheAttendanceToDelete.Group.organizerId == loggedInUserId)

    if (!isCurrentUser && !isOrganizer) {
        // 403 forbidden
        let error = {
            "message": "Only the User or organizer may delete an Attendance"
        }
        res.status(403);
        return res.json(error)
    }

    const userBeingDeletedFrom = await User.findOne({
        where: {
            id: userIdToUseForDeletion
        }
    })

    if (!userBeingDeletedFrom) {
        res.status(400);
        return res.json(
            {
                "message": "Validation Error",
                "errors": {
                    "memberId": "User couldn't be found"
                }
            }
        )
    }

    const attendanceToDelete = await Attendance.findOne({
        where: {
            userId: userIdToUseForDeletion,
            eventId: eventId
        }
    })

    if (!attendanceToDelete) {
        res.status(404);
        return res.json(
            {
                "message": "Attendance does not exist for this User"
            }
        )
    }

    // sometimes you have to roll the hard six
    await Attendance.destroy(
        {
            where:
            {
                id: attendanceToDelete.id
            }
        }
    )

    objectifyDeletionOfAttendance = {
        message: "Successfully deleted attendance from event"
    }

    return res.json(objectifyDeletionOfAttendance)
})
// export it
module.exports = router;
