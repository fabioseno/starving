/*global console, process, require*/
var express = require('express'),
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

app.listen(port);
console.log('>> Starving Server started listening on port ' + port);