/*global angular*/
(function () {
    'use strict';

    function ServiceConfig() {
        var endpoints = {
            baseUrl: 'http://localhost:3000',

            user: {
                list: {
                    url: '/users',
                    method: 'GET'
                }
            },

            poll: {
                getStatus: {
                    url: '/poll/status/:userId',
                    method: 'GET'
                },
                chooseRestaurant: {
                    url: '/poll/:userId/:restaurantId',
                    method: 'GET'
                }
            }
        },

            getEndpoint = function (module, operation, params) {
                var endpoint = endpoints[module][operation],
                    result = {};

                result.url = endpoints.baseUrl + endpoint.url;
                result.method = endpoint.method;
                
                // replaces url parameters with values from params
                result.url = result.url.replace(/:(\w+)/g, function (substring, match) {
                    params = params || {};

                    var routeValue = params[match];
                    if (!routeValue) {
                        routeValue = ':' + match;
                    }
                    
                    return routeValue;
                });
                
                return result;
            };
        
        return {
            getEndpoint: getEndpoint
        };
    }

    ServiceConfig.$inject = [];

    angular.module('app').service('serviceConfig', ServiceConfig);

}());