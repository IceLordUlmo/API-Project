// backend/routes/index.js

// create the Express router
const express = require('express');
const router = express.Router();

// import API router
const apiRouter = require('./api');

// add API router
router.use('/api', apiRouter);

// Add a XSRF-TOKEN cookie
router.get("/api/csrf/restore", (req, res) => {
    const csrfToken = req.csrfToken();
    res.cookie("XSRF-TOKEN", csrfToken);
    res.status(200).json({
        'XSRF-Token': csrfToken
    });
});

// GET /api/set-token-cookie
const { setTokenCookie } = require('../utils/auth.js');
const { User } = require('../db/models');
router.get('/set-token-cookie', async (_req, res) => {
    const user = await User.findOne({
        where: {
            username: 'Demo-lition'
        }
    });
    setTokenCookie(res, user);
    return res.json({ user: user });
});

// export this router
module.exports = router;
