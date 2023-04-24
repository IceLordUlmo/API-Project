// backend/routes/api/users.js

// create the router, import bcrypt
const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Membership, GroupImage, Group } = require('../../db/models');
const router = express.Router();

// import express validator and function to validate request bodies
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

router.delete("/:imageId", requireAuth, async (req, res) => {
    const { imageId } = req.params;
    const userId = req.user.id;
    const imageIdToDelete = imageId;

    const groupImageToDelete = await GroupImage.findOne({
        where: {
            id: imageIdToDelete
        },
        include: {
            model: Group,
            attributes: ["id", "organizerId"]
        }
    })

    if (!groupImageToDelete) {
        res.status(404);
        return res.json(
            {
                'message': "Group image couldn't be found"
            }
        )
    }

    const groupForDeletedGroupImage = await Group.findOne({
        where: {
            id: groupImageToDelete.Event.groupId
        }
    })

    const cohostMembershipOfTheUser = await Membership.findOne({
        where: {
            groupId: groupImageToDelete.Event.groupId,
            status: "co-host",
            userId: userId
        }
    })

    let organizerId = groupForDeletedGroupImage.organizerId;

    // if there's no cohost membership and we're not the organizer
    if (!cohostMembershipOfTheUser &&
        organizerId !== userId) {
        let error = { 'message': 'Current User must be the organizer of the group or a member of the group with a status of "co-host"' }
        res.status(403);
        return res.json(error)
    }

    await GroupImage.destroy({
        where: {
            id: imageIdToDelete
        }
    })

    const objectifyDeletion = { "message": "Successfully deleted" }

    return res.json(objectifyDeletion)
})

// export it
module.exports = router;
