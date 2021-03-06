// 'use strict';
/*jshint esversion: 6 */

const express = require('express');
const path = require('path');
const createError = require('http-errors');
const cors = require('cors');

const gptcrouter = require('./routes/gptc');
const cryptoartrouter = require('./routes/cryptoart');

const env = process.env.NODE_ENV || 'development';
const port = process.env.PORT || 8082;

// const config = require('./src/config/config.js');

const app = express();


app.use(express.static(__dirname + '/public'));

app.use(cors());

app.use('/gptc', gptcrouter);
app.use('/cryptoart', cryptoartrouter);

app.use(function (req, res, next) {
    if (req.originalUrl && req.originalUrl.split("/").pop() === 'favicon.ico') {
        return res.sendStatus(204);
    }
    return next();
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let error = createError(404);
    next(error);
});

// error handler
app.use(function (err, req, res, next) {
    console.log(err);
    res.status(err.status || 500);
    if (env === 'development') {
        res.json({
            'message': err.message,
            'stack': err.stack
        });
    } else {
        res.json({
            'message': err.message
        });
    }
});

var server = app.listen(port, function () {
    console.log(`The cryptoart listening on port ${port}!`);
});

module.exports = server;