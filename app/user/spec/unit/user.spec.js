(function() {
    'use strict';

    describe('Users service', function() {
        var $controller, UserService;

        beforeEach(angular.mock.module('ui.router'));
        beforeEach(angular.mock.module('app.users'));

        beforeEach(function() {

            module(function($provide) {
                $provide.value('CONST', jasmine.createSpy('CONST'));
                $provide.value('HelperService', { getPrevState: jasmine.createSpy('getPrevState') });
                $provide.value('prepSelUser', jasmine.createSpy('prepSelUser'));
                $provide.value('prepCurUser', jasmine.createSpy('prepCurUser'));
            });

        });

        beforeEach(inject(function(_UserService_) {
            UserService = _UserService_;
        }));

        it('should exist', function() {
            expect(UserService).toBeDefined();
        });

        it('should have the required attributes', function() {
            expect(UserService.editMe).toBeDefined();
            expect(UserService.search).toBeDefined();
            expect(UserService.add).toBeDefined();
            expect(UserService.edit).toBeDefined();
            expect(UserService.delete).toBeDefined();
            expect(UserService.getById).toBeDefined();
        });

        it('should find a user by id', function() {
            var id = "1234567890";
            UserService.getById(id).then(function(result) {
                expect(result).toBeDefined();
            });
        });

        it('should search for a user', function() {
            var searchStr = "Mock User";
            UserService.search(searchStr, '', 1, 20).then(function(result) {
                expect(result).toBeDefined();
            });
        });

        it('should add a user', function() {
            var data =
                {
                    email: "string",
                    name: "string",
                    role: "string",
                    is_confirmed: true,
                    is_admin: true,
                    is_vendor: false,
                    is_customer: false,
                    is_active: true,
                    provider: "string",
                    last_sign_in_at: "2017-05-05T16:22:47.513Z",
                    created_at: "2017-05-05T16:22:47.513Z",
                    updated_at: "2017-05-05T16:22:47.513Z"
                };

            UserService.add(data).then(function(result) {
                expect(result).toBeDefined();
            });
        });

        it('should edit a user', function() {
            var id = "1234567890";
            var data =
                {
                    email: "string",
                    name: "string",
                    role: "string",
                    is_confirmed: true,
                    is_admin: true,
                    is_vendor: false,
                    is_customer: false,
                    is_active: true,
                    provider: "string",
                    last_sign_in_at: "2017-05-05T16:22:47.513Z",
                    created_at: "2017-05-05T16:22:47.513Z",
                    updated_at: "2017-05-05T16:22:47.513Z"
                };

            UserService.edit(id, data).then(function(result) {
                expect(result).toBeDefined();
            });
        });

        it('should get vendor information', function() {
            var id='123456789';
            var req = {
                name: 'Vendor Name',
                email: 'vendor@example.com'
            }

            UserService.editMe(id, req).then(function(result) {
                expect(result).toBeDefined();
            });
        });

        describe('Account edit controller', function() {

            var scope, controller, httpBackend;

            beforeEach(inject(function($controller, $rootScope, $httpBackend) {

                scope = $rootScope.$new();
                httpBackend = $httpBackend;

                controller = $controller('UserInfoController', {
                    $scope: scope,
                    $http: $httpBackend
                });
            }));

            it('should exist', function() {
                expect(controller).toBeDefined();
            });

        });


        describe('User dashboard controller', function() {

            var scope, controller, httpBackend;

            beforeEach(inject(function($controller, $rootScope, $httpBackend) {

                scope = $rootScope.$new();
                httpBackend = $httpBackend;

                controller = $controller('UserController', {
                    $scope: scope,
                    $http: $httpBackend
                });
            }));

            it('should exist', function() {
                expect(controller).toBeDefined();
            });

        });

        describe('User edit controller', function() {

            var scope, controller, httpBackend;

            beforeEach(inject(function($controller, $rootScope, $httpBackend) {

                scope = $rootScope.$new();
                httpBackend = $httpBackend;

                controller = $controller('UserEditController', {
                    $scope: scope,
                    $http: $httpBackend
                });
            }));

            it('should exist', function() {
                expect(controller).toBeDefined();
            });

        });

        describe('User view controller', function() {

            var scope, controller, httpBackend;

            beforeEach(inject(function($controller, $rootScope, $httpBackend) {

                scope = $rootScope.$new();
                httpBackend = $httpBackend;

                controller = $controller('UserViewController', {
                    $scope: scope,
                    $http: $httpBackend
                });
            }));

            it('should exist', function() {
                expect(controller).toBeDefined();
            });

        });

    });
})();
