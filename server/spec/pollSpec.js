/*global require, describe, it, expect, done, beforeEach*/
var request = require('request');
var starving  = require('../app.js');
var baseUrl = 'http://localhost:3000/poll/';
var pollController = require('../controllers/poll');
var restaurantController = require('../controllers/restaurant');
var newStatusUrl;

describe('Poll API', function () {

    describe('User Story 1 - Allow only 1 vote per user per day', function () {

        beforeEach(function () {
            var userId = 1;

            newStatusUrl = baseUrl + 'status/' + userId;
        });

        it('should return a list with ALL restaurants if time is before noon', function (done) {
            var userId = 1,
                datetime = 1491051600000; // 2017-04-01 10:00 (before noon)

            request.get(newStatusUrl + '/' + datetime, function (error, response, body) {
                var resp = JSON.parse(body);

                expect(resp.data.restaurants).toEqual(restaurantController.restaurants);
                done();
            });

        });

        it('should return a status \'open\' if time is before noon', function (done) {
            var userId = 1,
                datetime = 1491051600000; // 2017-04-01 10:00 (before noon)

            request.get(newStatusUrl + '/' + datetime, function (error, response, body) {
                var resp = JSON.parse(body);

                expect(resp.data.status).toEqual('open');

                done();
            });

        });

        it('should return a status \'ended\' if the current time has passed noon', function (done) {
            var userId = 1,
                datetime = 1491071400000; // 2017-04-01 15:30 (after noon)

            request.get(newStatusUrl + '/' + datetime, function (error, response, body) {
                var resp = JSON.parse(body);

                expect(resp.data.status).toEqual('ended');
                done();
            });

        });

        it('should return a status \'inProgress\' if the current time is before noon and the user has already voted', function (done) {
            var userId = 1,
                restaurantId = 1,
                voteUrl = baseUrl + 'vote/' + userId + '/' + restaurantId,
                datetime = 1491051600000; // 2017-04-01 10:00 (before noon)

            request.get(voteUrl + '/' + datetime, function (error, response, body) {
                var resp = JSON.parse(body);

                expect(resp.data.status).toEqual('inProgress');
                done();
            });
        });

        it('should not allow votes after noon', function (done) {
            var datetime = 1485361800000; // 2017-01-25 14:30

            // user 1 trying to vote after noon
            request.get(baseUrl + 'vote/1/2/' + datetime, function (error, response, body) {
                var resp = JSON.parse(body);

                expect(resp.data.status).toEqual('ended');
                done();
            });

        });

    });

    describe('User Story 2 - Exclude chosen restaurants in the same week', function () {
        it('should retrieve all restaurants if it is a new week', function (done) {
            var pastDatetime = 1491051600000, // 2017-04-01 10:00 (past date)
                recentDatetime = 1491141600000; // 2017-04-02 11:00 (newer date in a different week)

            // restaurant 1 was chosen
            request.get(baseUrl + 'vote/1/1/' + pastDatetime, function (error, response, body) {});
            request.get(baseUrl + 'vote/2/1/' + pastDatetime, function (error, response, body) {});
            request.get(baseUrl + 'vote/3/1/' + pastDatetime, function (error, response, body) {});
            request.get(baseUrl + 'vote/4/1/' + pastDatetime, function (error, response, body) {});
            request.get(baseUrl + 'vote/5/1/' + pastDatetime, function (error, response, body) {});
            request.get(baseUrl + 'vote/6/1/' + pastDatetime, function (error, response, body) {});

            // restaurant 1 appears again as it is a new week
            request.get(baseUrl + 'status/1/' + recentDatetime, function (error, response, body) {
                var resp = JSON.parse(body);

                expect(resp.data.restaurants.length).toEqual(restaurantController.restaurants.length);
                done();
            });

        });

        it('should not retrieve previous chosen restaurants in the same week', function (done) {
            var pastDatetime = 1490794200000, // 2017-03-29 10:00 (past date)
                recentDatetime = 1490882400000, // 2017-03-30 11:00 (newer date in the same week)
                restaurantFound = false,
                i;

            // user = all / restaurant = 1
            request.get(baseUrl + 'vote/1/1/' + pastDatetime, function (error, response, body) {});
            request.get(baseUrl + 'vote/2/1/' + pastDatetime, function (error, response, body) {});
            request.get(baseUrl + 'vote/3/1/' + pastDatetime, function (error, response, body) {});
            request.get(baseUrl + 'vote/4/1/' + pastDatetime, function (error, response, body) {});
            request.get(baseUrl + 'vote/5/1/' + pastDatetime, function (error, response, body) {});
            request.get(baseUrl + 'vote/6/1/' + pastDatetime, function (error, response, body) {});

            // restaurant = 1 must not be in the list because we are in the same week
            request.get(baseUrl + 'status/1/' + recentDatetime, function (error, response, body) {
                var resp = JSON.parse(body);

                for (i = 0; i < resp.data.restaurants.length; i += 1) {
                    if (resp.data.restaurants[i].id === 1) {
                        restaurantFound = true;
                    }
                }

                expect(restaurantFound).toBeFalsy();

                done();
            });

        });
    });

    describe('User Story 3 - Display the chosen restaurant', function () {
        it('should display immediately if all users have already voted', function (done) {
            var datetime = 1490362200000; // 2017-03-24 10:30

            // restaurant 2 was chosen
            request.get(baseUrl + 'vote/1/2/' + datetime, function (error, response, body) {});
            request.get(baseUrl + 'vote/2/2/' + datetime, function (error, response, body) {});
            request.get(baseUrl + 'vote/3/2/' + datetime, function (error, response, body) {});
            request.get(baseUrl + 'vote/4/2/' + datetime, function (error, response, body) {});
            request.get(baseUrl + 'vote/5/2/' + datetime, function (error, response, body) {});
            request.get(baseUrl + 'vote/6/2/' + datetime, function (error, response, body) {});

            // restaurant 2 should be retrieved as a winner
            request.get(baseUrl + 'status/1/' + datetime, function (error, response, body) {
                var resp = JSON.parse(body),
                    restaurants = restaurantController.restaurants,
                    restaurant,
                    i;

                for (i = 0; i < restaurants.length; i += 1) {
                    if (restaurants[i].id === 2) { // restaurantId = 2
                        restaurant = restaurants[i];
                        break;
                    }
                }

                expect(resp.data.status).toEqual('ended');
                expect(resp.data.restaurant).toEqual(restaurant);
                done();
            });

        });

        it('should not display the results if not all users have already voted', function (done) {
            var datetime = 1488029400000; // 2017-02-25 10:30

            // restaurant 2 is winning but not everybody has yet voted
            request.get(baseUrl + 'vote/1/2/' + datetime, function (error, response, body) {});
            request.get(baseUrl + 'vote/2/2/' + datetime, function (error, response, body) {});
            request.get(baseUrl + 'vote/3/2/' + datetime, function (error, response, body) {});

            // restaurant 2 should not be retrieved as a winner
            request.get(baseUrl + 'status/4/' + datetime, function (error, response, body) {
                var resp = JSON.parse(body);

                expect(resp.data.status).toEqual('open');
                expect(resp.data.restaurants.length).toEqual(restaurantController.restaurants.length);
                done();
            });

        });

        it('should display the results if current time has passed noon, even if not all users have voted', function (done) {
            var beforeNoonDatetime = 1485343800000, // 2017-01-25 09:30 (to allow voting)
                afterNoonDatetime = 1485361800000; // 2017-01-25 14:30 (to display voting results)

            // restaurant 2 is winning but not everybody has yet voted
            request.get(baseUrl + 'vote/1/2/' + beforeNoonDatetime, function (error, response, body) {});
            request.get(baseUrl + 'vote/2/2/' + beforeNoonDatetime, function (error, response, body) {});
            request.get(baseUrl + 'vote/3/2/' + beforeNoonDatetime, function (error, response, body) {});

            // restaurant 2 should be retrieved as a winner
            request.get(baseUrl + 'status/4/' + afterNoonDatetime, function (error, response, body) {
                var resp = JSON.parse(body),
                    restaurants = restaurantController.restaurants,
                    restaurant,
                    i;
                for (i = 0; i < restaurants.length; i += 1) {
                    if (restaurants[i].id === 2) { // restaurantId = 2
                        restaurant = restaurants[i];
                        break;
                    }
                }

                expect(resp.data.status).toEqual('ended');
                expect(resp.data.restaurant).toEqual(restaurant);
                done();
            });

        });

    });

});