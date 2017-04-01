/*global angular, alert*/
(function () {
    'use strict';
    
    function Login($location, securityService, userService, toaster) {
        var vm = this;
        
        vm.getUsers = function () {
            userService.getUsers().then(function (result) {
                if (result && result.success) {
                    vm.users = result.data;
                }
            }, function (error) {
                toaster.show('Something went wrong!');
            });
        };
        
        vm.chooseUser = function (user) {
            securityService.login(user).then(function (result) {
                if (result && result.success) {
                    $location.path('/poll');
                }
            });
        };
        
        vm.getUsers();
    }
    
    Login.$inject = ['$location', 'securityService', 'userService', 'toaster'];
    
    angular.module('app').controller('login', Login);
    
}());