/*global require, module*/
var moment         = require('moment');
var userController = require('../controllers/user');
var restaurantController = require('../controllers/restaurant');
var inMemoryPoll = {};
//var inMemoryPoll = {"13": {"2017-03-29": [{"id": 1, "votes": [1, 2, 3, 4, 5, 6] }]}};


var getMomentDate = function (datetime) {
    if (moment.isDate(new Date(datetime))) {
        return moment(new Date(datetime));
    } else {
        return moment();
    }
},

    getFormattedDate = function (datetime) {
        return getMomentDate(datetime).format('YYYY-MM-DD');
    },

    getNoonDate = function (datetime) {
        return moment(getMomentDate(datetime).format('YYYY-MM-DD') + ' 12:00', 'YYYY-MM-DD HH:mm').toDate();
    },

    getRestaurantVotes = function (datetime) {
        var weekOfYear = getMomentDate(datetime).week(),
            formattedDate = getFormattedDate(datetime),
            restaurants = [];
        
        if (inMemoryPoll[weekOfYear] && inMemoryPoll[weekOfYear][formattedDate]) {
            restaurants = inMemoryPoll[weekOfYear][formattedDate];
        }

        return restaurants;
    },

    getWeekVotes = function (datetime) {
        var weekOfYear = getMomentDate(datetime).week(),
            weekVotes = {};

        if (inMemoryPoll[weekOfYear]) {
            weekVotes = inMemoryPoll[weekOfYear];
        }

        return weekVotes;
    },

    getTotalVotes = function (datetime) {
        var restaurants = getRestaurantVotes(datetime),
            total = 0,
            i;

        for (i = 0; i < restaurants.length; i += 1) {
            total += restaurants[i].votes.length;
        }

        return total;
    },

    hasUserVoted = function (datetime, userId) {
        var restaurants = getRestaurantVotes(datetime),
            restaurantVotes,
            found = false,
            i,
            j;


        for (i = 0; i < restaurants.length; i += 1) {
            restaurantVotes = restaurants[i].votes;

            for (j = 0; j < restaurantVotes.length; j += 1) {
                if (restaurantVotes[j] === userId) {
                    found = true;
                    break;
                }
            }

            if (found) {
                break;
            }
        }
        
        return found;
    },

    getMostVotedRestaurant = function (datetime) {
        var restaurants = getRestaurantVotes(datetime),
            votedRestaurant,
            votes = 0,
            i;

        for (i = 0; i < restaurants.length; i += 1) {
            if (restaurants[i].votes.length >= votes) {
                votes += restaurants[i].votes.length;
                votedRestaurant = restaurantController.getRestaurant(restaurants[i].id);
            }
        }

        return votedRestaurant;
    },

    getAvailableRestaurants = function (datetime) {
        var availableRestaurants = restaurantController.restaurants,
            days = getWeekVotes(datetime),
            mostVotedRestaurant,
            savedDatetime,
            restaurants,
            date,
            j;

        // removes previous winner restaurants in the same week
        for (date in days) {
            if (date < getFormattedDate(datetime)
                    || (date === getFormattedDate(datetime) && (new Date(datetime) > getNoonDate(datetime)))) {

                mostVotedRestaurant = getMostVotedRestaurant(moment(date, 'YYYY-MM-DD'));

                if (mostVotedRestaurant) {
                    for (j = availableRestaurants.length - 1; j >= 0; j -= 1) {
                        if (availableRestaurants[j].id === mostVotedRestaurant.id) {
                            availableRestaurants.splice(j, 1);
                            break;
                        }
                    }
                }
            }
        }

        return availableRestaurants;
    },

    /*
        var flow = {
            beforeNoon: {
                yes: {
                    hasVoted: {
                        yes: {
                            allVoted: {
                                yes: {
                                    status: 'ended',
                                    showResults: {}
                                },
                                no: {
                                    status: 'inProgress'
                                }
                            }
                        },
                        no: {
                            status: 'open',
                            restaurants: []
                        }
                    }
                },
                no: {
                    status: 'ended',
                    showResults: {}
                }
            }
    */

    getStatus = function (req, res) {
        var result = {},
            noonDate,
            userHasVoted,
            datetime;

        if (req.params.datetime) {
            datetime = new Date(parseInt(req.params.datetime)).getTime();
        } else {
            datetime = getMomentDate(new Date().getTime());
        }

        if (req.params.userId) {
            noonDate = getNoonDate(datetime);
            
            // open for voting
            if (new Date(datetime) < noonDate) {
                // user already voted
                if (hasUserVoted(datetime, parseInt(req.params.userId))) {
                    // everybody has voted
                    if (getTotalVotes(datetime) === userController.getTotalUsers()) {
                        result = {
                            status: 'ended',
                            restaurant: getMostVotedRestaurant(datetime)
                        };
                    } else {
                        result = {
                            status: 'inProgress'
                        };
                    }
                } else {
                    result = {
                        status: 'open',
                        restaurants: getAvailableRestaurants(datetime)
                    };
                }
            } else {
                result = {
                    status: 'ended',
                    restaurant: getMostVotedRestaurant(datetime)
                };
            }

            result.date = new Date(datetime);
            return res.send({ success: true, data: result});
        }

        return res.send({ success: false });
    },

    vote = function (req, res) {
        var restaurantId = parseInt(req.params.restaurantId),
            userId = parseInt(req.params.userId),
            restaurantFound = false,
            restaurants = [],
            result = {},
            datetime,
            i;

        if (req.params.datetime) {
            datetime = new Date(parseInt(req.params.datetime)).getTime();
        } else {
            datetime = getMomentDate(new Date().getTime());
        }

        if (!hasUserVoted(datetime, userId)) {
            var weekOfYear = getMomentDate(datetime).week();

            var formattedDate = getFormattedDate(datetime);

            if (new Date(datetime) < getNoonDate(datetime)) {
    
                if (inMemoryPoll[weekOfYear] && inMemoryPoll[weekOfYear][formattedDate]) {
                    restaurants = inMemoryPoll[weekOfYear][formattedDate];

                    for (i = 0; i < restaurants.length; i += 1) {
                        if (restaurants[i].id === restaurantId) {
                            restaurants[i].votes.push(userId);

                            restaurantFound = true;
                        }
                    }
                }

                if (!restaurantFound) {
                    if (restaurantController.getRestaurant(restaurantId)) {
                        if (!inMemoryPoll[weekOfYear]) {
                            inMemoryPoll[weekOfYear] = {};
                        }

                        if (!inMemoryPoll[weekOfYear][formattedDate]) {
                            inMemoryPoll[weekOfYear][formattedDate] = [];
                        }

                        inMemoryPoll[weekOfYear][formattedDate].push({
                            id: restaurantId,
                            votes: [userId]
                        });
                    }
                }
            }
        } else {
            result = {
                success: false,
                message: 'Time limit has already been reached'
            };
        }

        getStatus(req, res);
    };

module.exports = {
    getStatus: getStatus,
    vote: vote
};