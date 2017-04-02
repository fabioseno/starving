/*global require, describe, it, expect, done*/
var request = require('request');
var starving  = require('../app.js');
var baseUrl = "http://localhost:3000/";

describe('Starving Server', function () {

    describe('GET /', function () {

        it('should return status code 200', function (done) {

            request.get(baseUrl, function (error, response, body) {
                expect(response.statusCode).toBe(200);
                done();
            });

        });

        it('should return a \'Server up and running!\' message', function (done) {
            request.get(baseUrl, function (error, response, body) {
                expect(body).toBe('Server up and running!');
                done();
            });
        });
    });

});