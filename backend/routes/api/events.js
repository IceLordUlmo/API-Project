// backend/routes/api/users.js

// create the router, import bcrypt
const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Attendance } = require('../../db/models');
const { Event } = require('../../db/models');
const { EventImage } = require('../../db/models');
const { Group } = require('../../db/models');
const { GroupImage } = require('../../db/models');
const { Membership } = require('../../db/models');
const { User } = require('../../db/models');
const { Venue } = require('../../db/models');
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
        errorList.page = "Page must be greater than or equal to 1";
        errorFlag = true;
    }
    if (startDate && !Number.isInteger(Date.parse(startDate))) {
        errorList.date = "Start date must be in date format";
        errorFlag = true;
    }
    if (type && type !== 'Online' && type !== 'In person') {
        errorList.type = "Type must be 'Online' or 'In Person'";
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
        where.startDate = startDate
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

        const eventId = event.Id;

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
        }
    })

    const cohostMembershipOfTheUser = await Membership.findOne({
        where: {
            groupId: groupForAddedImage.Event.groupId,
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
            groupId: groupForEditedEvent.Event.groupId,
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


    const now = (new Date()).toDateString();
    const startDateString = new Date(startDate).toDateString();
    const endDateString = new Date(endDate).toDateString();
    const errorList = {};
    let errorFlag = false;


    if (!venueId || !Number.isInteger(venueId)) {
        errorList.venueId = "Venue does not exist";
        errorFlag = true;
    }

    if (!name || name.length < 5) {
        errorList.name = "Name must be at least 5 characters";
        errorFlag = true;
    }
    if (type !== "Online" && type !== "In Person") {
        errorList.type = "Type must be Online or In Person";
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
    if (now >= startDateString) {
        errorList.startDate = "Start date must be in the future";
        errorFlag = true;
    }
    if (startDateString > endDateString) {
        errorList.endDate = "End date is less than start date";
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
            id: eventToDelete.groupId
        }
    })

    const cohostMembershipOfTheUser = await Membership.findOne({
        where: {
            groupId: groupForDeletedEvent.Event.groupId,
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
// export it
module.exports = router;
