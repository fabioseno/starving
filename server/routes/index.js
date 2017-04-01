/*global require, module*/
module.exports = function (app) {
    'use strict';
    
    // List all users
    app.get('/', function (req, res) {
        res.send('Server up and running!');
    });
    
    app.all('*', function (req, res, next) {
        
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');

        next();
    });
    
    app.get('/test/:id', function (req, res) {
        res.send(req.params.id);
    });

    require('./user')(app);
    require('./poll')(app);
    
};