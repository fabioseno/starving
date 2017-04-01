/*jslint nomen: true*/
/*global angular, describe, it, beforeEach, module, spyOn, inject, jasmine, expect*/
describe('securityService', function () {
    'use strict';

    var service,
        $httpBackend;

    beforeEach(module('app'));
    
    // disable template caching
    beforeEach(module(function ($provide, $urlRouterProvider) {
        $provide.value('$ionicTemplateCache', function () {});
        $urlRouterProvider.deferIntercept();
    }));

    beforeEach(inject(function (_$httpBackend_, userService) {
        $httpBackend = _$httpBackend_;
        service = userService;
    }));

    describe('getUsers', function () {
        it('should call $http with correct backend endpoint configurations', function () {
            $httpBackend.expect('GET', 'http://localhost:3000/users').respond(200, { success: true });

            service.getUsers();

            $httpBackend.flush();
        });
    });

});