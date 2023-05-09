// backend/utils/validation.js
const { validationResult } = require('express-validator');

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        const err = Error("Bad request.");
        err.status = 400;
        err.title = "Bad request.";

        const errorList = {};

        //reformatting errors to work with frontend
        validationErrors
            .array()
            .forEach(error => errorList[error.path] = error.msg);

        err.errors = errorList;

        next(err);
    }
    next();
};

module.exports = {
    handleValidationErrors
};
