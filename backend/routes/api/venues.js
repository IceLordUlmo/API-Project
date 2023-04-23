// backend/routes/api/users.js

// create the router, import bcrypt
const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Venue, Group, Membership } = require('../../db/models');
const router = express.Router();

// import express validator and function to validate request bodies
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const venue = require('../../db/models/venue');


// edit venue specified by id
router.put("/:venueId", requireAuth, async (req, res) => {
    const { venueId } = req.params;
    const venueIdToEdit = venueId;
    const { address, city, state, lat, lng } = req.body;

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
    if (lat < -90 ||
        lat > 90 ||
        typeof lat != "number") {
        errorList.lat = 'Latitude is not valid'
        errorFlag = true;
    }
    if (lng < -180 ||
        lng > 180 ||
        typeof lng != "number") {
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

    const venueToEdit = await Venue.findOne({
        where: {
            id: venueIdToEdit
        },
        include: {
            model: Group,
            attributes: ["id", "organizerId"]
        }
    })

    if (!venueToEdit) {
        res.status(404)
        return res.json({ 'message': "Venue couldn't be found" })
    }

    // check for organizer or cohost authorization
    let currentUserId = req.user.id
    let organizerId = venueToEdit.Group.organizerId

    const cohostMemberships = await Membership.findAll({
        where: {
            userId: currentUserId,
            status: "co-host"
        }
    })

    const cohostedGroups = cohostMemberships.map(membership => { return membership.groupId })

    if (currentUserId != organizerId) {
        if (!cohostedGroups.includes(groupId)) {
            let error = { 'message': 'Current User must be the organizer of the group or a member of the group with a status of "co-host"' }
            res.status(403);
            return res.json(error)
        }
    }

    // everything is fine, passed all the errors

    venueToEdit.update({
        address: address,
        city: city,
        state: state,
        lat: lat,
        lng: lng
    })

    objectifyVenue = {
        id: venueToEdit.id,
        groupId: venueToEdit.groupId,
        address: venueToEdit.address,
        city: venueToEdit.city,
        state: venueToEdit.state,
        lat: venueToEdit.lat,
        lng: venueToEdit.lng
    }

    return res.json(objectifyVenue);
})

// export it
module.exports = router;
