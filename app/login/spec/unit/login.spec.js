(function() {
    'use strict';

    describe('Login controller', function() {

        var scope, controller, httpBackend;

        beforeEach(angular.mock.module('ui.router'));
        beforeEach(angular.mock.module('app.auth'));

        beforeEach(function() {

            module(function($provide) {
                $provide.value('CONST', jasmine.createSpy('CONST'));
                $provide.value('HelperService', { getPrevState: jasmine.createSpy('getPrevState') });
                $provide.value('AuthService', {
                    isAuthenticated: jasmine.createSpy('isAuthenticated'),
                    login: jasmine.createSpy('login')
                });
            });

        });

        beforeEach(inject(function($controller, $rootScope, $httpBackend) {

            scope = $rootScope.$new();
            httpBackend = $httpBackend;

            controller = $controller('LoginController', {
                $scope: scope,
                $http: $httpBackend
            });
        }));

        it('should exist', function() {
            expect(controller).toBeDefined();
        });

    });

})();