/*global module, require*/
module.exports = function (router) {
    'use strict';
    
    var userController = require('../controllers/user');
    
    // List all users
    router.get('/users', userController.list);
    
};