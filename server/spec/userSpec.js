/*global require, describe, it, expect, done*/
var request = require('request');
var starving  = require('../app.js');
var baseUrl = 'http://localhost:3000/users';
var userController = require('../controllers/user');

describe('User API', function () {

    describe('GET /users', function () {

        it('should return status code 200', function (done) {

            request.get(baseUrl, function (error, response, body) {
                expect(response.statusCode).toBe(200);
                done();
            });

        });

        it('should return a list of users', function (done) {

            request.get(baseUrl, function (error, response, body) {
                var resp = JSON.parse(body);

                expect(resp.data).toEqual(userController.users);
                starving.closeServer();
                done();
            });

        });
    });

});