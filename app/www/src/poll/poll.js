/*global angular*/
(function () {
    'use strict';

    function Poll($location, pollService, securityService) {
        var vm = this,

            watchResults = function (result) {
                if (result && result.success) {
                    if (result.data && result.data.status) {
                        vm.pollStatus = result.data.status;

                        switch (result.data.status) {
                        case 'open':
                            vm.restaurants = result.data.restaurants;
                            break;
                        case 'inProgress':
                            vm.restaurants = result.data.restaurants;
                            break;
                        case 'ended':
                            vm.restaurant = result.data.restaurant;
                            break;
                        }
                    }
                }
            };

        vm.sliderOptions = {
            initialSlide: 0,
            direction: 'horizontal', //or vertical
            speed: 300 //0.3s transition
        };

        vm.sliderDelegate = null;

        vm.getPollStatus = function () {
            pollService.getPollStatus().then(watchResults);
        };

        vm.chooseRestaurant = function (restaurant) {
            var user = securityService.getCurrentUser();
            
            pollService.chooseRestaurant(user.id, restaurant.id).then(watchResults);
        };

        vm.refreshResults = function () {
            vm.getPollStatus();
        };

        vm.logout = function () {
            securityService.logout().then(function () {
                $location.path('/');
            });
        };

        vm.getPollStatus();
    }

    Poll.$inject = ['$location', 'pollService', 'securityService'];

    angular.module('app').controller('poll', Poll);

}());