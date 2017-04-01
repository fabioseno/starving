/*jslint nomen: true*/
/*global angular, describe, it, beforeEach, module, spyOn, inject, jasmine, expect*/
describe('securityService', function () {
    'use strict';

    var service,
        $q,
        $window,
        
        loginUser = {
            id: 1,
            name: 'Test user'
        };

    beforeEach(module('app'));

    beforeEach(inject(function (_$window_, securityService) {
        service = securityService;

        $window = _$window_;
    }));

    describe('login', function () {
        it('should return nothing if no login has been called', function () {
            expect($window.sessionStorage.getItem('CURRENT_USER')).toBe(null);
        });

        it('should store the selected user in the browsers sessionStorage', function () {
            service.login(loginUser);

            expect($window.sessionStorage.getItem('CURRENT_USER')).toEqual(angular.toJson(loginUser));
        });
    });

    describe('logout', function () {
        it('should clear the sessionStorage entry after logout', function () {
            service.login(loginUser);

            expect($window.sessionStorage.getItem('CURRENT_USER')).toEqual(angular.toJson(loginUser));

            service.logout();

            expect($window.sessionStorage.getItem('CURRENT_USER')).toEqual(null);
        });
    });

    describe('getCurrentUser', function () {
        it('should get nothing is no login has been done', function () {
            expect(service.getCurrentUser()).toEqual({});
        });

        it('should return logged user', function () {
            service.login(loginUser);

            expect(service.getCurrentUser()).toEqual(loginUser);
        });
    });

});