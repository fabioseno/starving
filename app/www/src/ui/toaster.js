/*global angular*/
(function () {
    'use strict';

    function Toaster($ionicLoading) {
        var show = function (message) {
            if (!message) {
                message = 'Loading...';
            }

            $ionicLoading.show({
                template: message,
                duration: 2000
            });
        },

            hide = function () {
                $ionicLoading.hide();
            };

        return {
            show: show,
            hide: hide
        };
    }

    Toaster.$inject = ['$ionicLoading'];

    angular.module('app').service('toaster', Toaster);

}());