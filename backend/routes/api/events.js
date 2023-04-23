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
// export it
module.exports = router;
