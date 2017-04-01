/*global angular*/
(function () {
    'use strict';

    function PollService(serviceConfig, securityService, $http) {
        var user = securityService.getCurrentUser(),

            getPollStatus = function () {
                var params = {
                    userId: user.id
                },
                    config = serviceConfig.getEndpoint('poll', 'getStatus', params);

                return $http(config).then(function (response) {
                    return response.data;
                });
            },

            chooseRestaurant = function (restaurantId) {
                var user = securityService.getCurrentUser(),

                    params = {
                        userId: user.id,
                        restaurantId: restaurantId
                    },
                    
                    config = serviceConfig.getEndpoint('poll', 'chooseRestaurant', params);

                return $http(config).then(function (response) {
                    return response.data;
                });
            };

        return {
            getPollStatus: getPollStatus,
            chooseRestaurant: chooseRestaurant
        };
    }

    PollService.$inject = ['serviceConfig', 'securityService', '$http'];

    angular.module('app').service('pollService', PollService);

}());