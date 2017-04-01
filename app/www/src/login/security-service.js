/*global angular*/
(function () {
    'use strict';
    
    function SecurityService($q, $window) {
        var login = function (user) {
                $window.sessionStorage.setItem('CURRENT_USER', angular.toJson(user));
            
                return $q.when({ success: true, data: true });
            },
            
            logout = function () {
                $window.sessionStorage.removeItem('CURRENT_USER');
                
                return $q.when({ success: true, data: { id: 1 } });
            },
            
            getCurrentUser = function () {
                return angular.fromJson($window.sessionStorage.getItem('CURRENT_USER') || {});
            };
        
        return {
            login: login,
            logout: logout,
            getCurrentUser: getCurrentUser
        };
    }
    
    SecurityService.$inject = ['$q', '$window'];
    
    angular.module('app').service('securityService', SecurityService);
    
}());