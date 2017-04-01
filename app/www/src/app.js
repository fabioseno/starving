/*global angular, cordova, StatusBar*/
(function () {
    'use strict';

    function Run($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
            }

            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    }

    function Config($ionicConfigProvider, $stateProvider, $urlRouterProvider) {
        $ionicConfigProvider.views.maxCache(0);
        $ionicConfigProvider.backButton.text('');
        $ionicConfigProvider.backButton.previousTitleText(false);
        
        $stateProvider.state('login', {
            url: '/login',
            templateUrl: 'src/login/login.html',
            controller: 'login as vm'
        }).state('poll', {
            url: '/poll',
            templateUrl: 'src/poll/poll.html',
            controller: 'poll as vm'
        });

        $urlRouterProvider.otherwise('/login');
    }

    angular.module('app', ['ionic']);
    angular.module('app').run(['$ionicPlatform', Run]);
    angular.module('app').config(['$ionicConfigProvider', '$stateProvider', '$urlRouterProvider', Config]);
}());