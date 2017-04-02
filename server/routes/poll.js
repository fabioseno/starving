/*global module, require*/
module.exports = function (router) {
    'use strict';
    
    var pollController = require('../controllers/poll');
    
    // Get poll status
    router.get('/poll/status/:userId/:datetime?', pollController.getStatus);
    
    // Vote
    router.get('/poll/vote/:userId/:restaurantId/:datetime?', pollController.vote);
    
};