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


// export this router
module.exports = router;
