// backend/routes/index.js

// create the Express router
const express = require('express');
const router = express.Router();


// create a testable route
router.get('/hello/world', function (req, res) {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    res.send('Hello World!');
});


// export this router
module.exports = router;
