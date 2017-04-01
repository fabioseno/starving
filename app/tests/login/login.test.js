/*jslint nomen: true*/
/*global describe, it, beforeEach, module, inject, jasmine, expect*/
describe('login', function () {
    'use strict';

    var $rootScope,
        $httpBackend,
        controller,
        locationMock,
        userServiceMock,
        securityServiceMock,
        toasterMock,
        deferredLogin;

    beforeEach(module('app'));

    // disable template caching
    beforeEach(module(function ($provide, $urlRouterProvider) {
        $provide.value('$ionicTemplateCache', function () {});
        $urlRouterProvider.deferIntercept();
    }));

    beforeEach(inject(function ($controller, $q) {
        deferredLogin = $q.defer();

        // mock $state
        locationMock = jasmine.createSpyObj('$location spy', ['path']);

        // mock userService
        userServiceMock = {
            getUsers: jasmine.createSpy('getUsers spy').and.returnValue(deferredLogin.promise)
        };

        // mock securityService
        securityServiceMock = {
            login: jasmine.createSpy('login spy').and.returnValue(deferredLogin.promise)
        };

        // mock toaster
        toasterMock = jasmine.createSpyObj('toaster spy', ['show']);

        // instantiate LoginController
        controller = $controller('login', {
            '$location': locationMock,
            'userService': userServiceMock,
            'securityService': securityServiceMock,
            'toaster': toasterMock
        });
    }));

    describe('getUsers', function () {

        it('should retrieve the user list', function () {
            expect(userServiceMock.getUsers).toHaveBeenCalled();
        });

    });

    describe('chooseUser', function () {
        var user = {
            id: 1,
            name: ''
        };

        // call chooseUser on the controller for every test
        beforeEach(inject(function (_$rootScope_) {
            $rootScope = _$rootScope_;
            controller.chooseUser(user);
        }));

        it('should store the selected user in the browser`s sessionStorage', function () {
            expect(securityServiceMock.login).toHaveBeenCalledWith(user);
        });

        it('should redirect to the restaurants view', function () {
            deferredLogin.resolve({ success: true, data: true });
            $rootScope.$apply();

            expect(locationMock.path).toHaveBeenCalledWith('/poll');
        });

    });

});