/*jslint nomen: true*/
/*global angular, describe, it, beforeEach, module, spyOn, inject, jasmine, expect*/
describe('pollService', function () {
    'use strict';

    var service,
        securityService,
        $httpBackend;

    beforeEach(module('app'));

    // disable template caching
    beforeEach(module(function ($provide, $urlRouterProvider) {
        $provide.value('$ionicTemplateCache', function () {});
        $urlRouterProvider.deferIntercept();
    }));

    beforeEach(inject(function (_$httpBackend_, _securityService_, pollService) {
        $httpBackend = _$httpBackend_;
        securityService = _securityService_;
        service = pollService;
    }));

    describe('getPollStatus', function () {
        it('should call $http with correct backend endpoint configurations', function () {
            var userId = 1;

            $httpBackend.expect('GET', 'http://localhost:3000/poll/status/' + userId).respond(200, { success: true });

            service.getPollStatus();

            $httpBackend.flush();
        });
    });

    describe('chooseRestaurant', function () {
        it('should call $http with correct backend endpoint configurations only if user is logged', function () {
            var user = {
                id: 1,
                name: 'Test user'
            },
                restaurantId = 2;

            securityService.login(user);

            $httpBackend.expect('GET', 'http://localhost:3000/poll/' + user.id + '/' + restaurantId).respond(200, { success: true });
            
            service.chooseRestaurant(restaurantId);

            $httpBackend.flush();
        });
    });

});