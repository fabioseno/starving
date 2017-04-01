/*global angular*/
(function () {
    'use strict';
    
    function UserService($http, serviceConfig) {
        var getUsers = function () {
            var config = serviceConfig.getEndpoint('user', 'list');
            
            return $http(config).then(function (response) {
                return response.data;
            });
        };
        
        return {
            getUsers: getUsers
        };
    }
    
    UserService.$inject = ['$http', 'serviceConfig'];
    
    angular.module('app').service('userService', UserService);
    
}());