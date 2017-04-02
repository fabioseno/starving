/*global console, process, require, module*/
var express = require('express'),
    exports = module.exports = {},
    app     = express(),
    port    = process.env.PORT || 3000;

// error handling
app.use(function (err, req, res, next) {
    'use strict';

    console.error(err.stack);
    res.status(500).send('Unexpected error!');
});

// ## ROUTES ##
require('./routes/')(app); // load our routes and pass in our app anpd fully configured passport

var server = app.listen(port);
console.log('>> Starving Server started listening on port ' + port);

exports.startServer = function () {
    server = app.listen(port);
};

exports.closeServer = function () {
    server.close();
};