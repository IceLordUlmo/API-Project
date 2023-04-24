// backend/routes/api/users.js

// create the router, import bcrypt
const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Event, EventImage, Group, Membership } = require('../../db/models');

const router = express.Router();

// import express validator and function to validate request bodies
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

router.delete("/:imageId", requireAuth, async (req, res) => {
    const { imageId } = req.params;
    const userId = req.user.id;
    const imageIdToDelete = imageId;

    let imageToBeDeleted = await EventImage.findOne({
        where: {
            id: imageIdToDelete
        },
        include: {
            model: Event
        }
    })

    if (!imageToBeDeleted) {
        res.status(404);
        return res.json(
            {
                'message': "Event Image couldn't be found"
            }
        )
    }

    const groupForDeletedImage = await Group.findOne({
        where: {
            id: imageToBeDeleted.Event.groupId
        }
    })

    const cohostMembershipOfTheUser = await Membership.findOne({
        where: {
            groupId: imageToBeDeleted.Event.groupId,
            status: "co-host",
            userId: userId
        }
    })

    let organizerId = groupForDeletedImage.organizerId;
    // this is feeling very convoluted
    // if there's no cohost membership and we're not the organizer
    if (!cohostMembershipOfTheUser &&
        organizerId !== userId) {
        let error = { 'message': 'Current User must be the organizer of the group or a member of the group with a status of "co-host"' }
        res.status(403);
        return res.json(error)
    }

    // this route is 99% validations and checks
    imageToBeDeleted.destroy()

    objectifyDeletion = { "message": "Successfully deleted" }

    return res.json(objectifyDeletion)
})

// export it
module.exports = router;
