// server middleware includes for later
const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

// route imports
const routes = require("./routes");

// check for Production environment
const { environment } = require('./config');
const isProduction = environment === 'production';

// initialize Express application
const app = express();

// connect morgan to log requests and responses
app.use(morgan('dev'));

// add cookie parsing middleware
app.use(cookieParser());

// add json parsing middleware
app.use(express.json());

// Security Middleware
if (!isProduction) {
    // enable cors only in development
    app.use(cors());
}

// helmet helps set a variety of headers to better secure your app
app.use(
    helmet.crossOriginResourcePolicy({
        policy: "cross-origin"
    })
);

// Set the _csrf token and create req.csrfToken method
app.use(
    csurf({
        cookie: {
            secure: isProduction,
            sameSite: isProduction && "Lax",
            httpOnly: true
        }
    })
);

// tie in the routes
app.use(routes);

// export the application for use
module.exports = app;
