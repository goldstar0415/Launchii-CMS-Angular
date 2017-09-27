(function() {
    'use strict';

    describe('Brands service', function() {
        var $controller, BrandService, UserService;

        beforeEach(angular.mock.module('ui.router'));
        beforeEach(angular.mock.module('app.brands'));
        beforeEach(angular.mock.module('app.users'));

        beforeEach(function() {

            module(function($provide) {
                $provide.value('CONST', jasmine.createSpy('CONST'));
                $provide.value('brandPrepService', { brands: [] });
                $provide.value('HelperService', { getPrevState: jasmine.createSpy('getPrevState') });
                $provide.value('prepSelBrand', jasmine.createSpy('prepSelBrand'));
            });
        });

        beforeEach(inject(function(_UserService_) {
            UserService = _UserService_;
        }));

        it('should exist', function() {
            expect(UserService).toBeDefined();
        });

        beforeEach(inject(function(_BrandService_) {
            BrandService = _BrandService_;
        }));

        it('should exist', function() {
            expect(BrandService).toBeDefined();
        });

        it('should have the required attributes', function() {
            expect(BrandService.search).toBeDefined();
            expect(BrandService.add).toBeDefined();
            expect(BrandService.edit).toBeDefined();
            expect(BrandService.delete).toBeDefined();
            expect(BrandService.getById).toBeDefined();
            expect(BrandService.vendorBrands).toBeDefined();
            expect(BrandService.getAll).toBeDefined();
        });

        it('should get all brands', function() {
            BrandService.search('', '', '', 'archived', 1, 500).then(function(result) {
                expect(result).toBeDefined();
            });
        });

        it('should add a brand', function() {
            var data =
                {
                    slug: "string",
                    name: "string",
                    description: "string",
                    email: "string",
                    facebook_url: "string",
                    twitter_url: "string",
                    instagram_url: "string",
                    logo_image: {
                        thumb_url: "string",
                        standard_url: "string",
                        large_url: "string"
                    },
                    cover_image: {
                        thumb_url: "string",
                        standard_url: "string",
                        large_url: "string"
                    },
                    logo: {
                        filetype: 'image/png'
                    },
                    cover: {
                        filetype: 'image/png'
                    },
                    created_at: "2017-05-03T12:53:25.117Z",
                    updated_at: "2017-05-03T12:53:25.117Z"
                }

            BrandService.add(data).then(function(result) {
                expect(result).toBeDefined();
            });
        });

        it('should edit a brand', function() {
            var id = "1234567890";
            var data =
                {
                    slug: "string",
                    name: "string",
                    description: "string",
                    email: "string",
                    facebook_url: "string",
                    twitter_url: "string",
                    instagram_url: "string",
                    logo_image: {
                        thumb_url: "string",
                        standard_url: "string",
                        large_url: "string"
                    },
                    cover_image: {
                        thumb_url: "string",
                        standard_url: "string",
                        large_url: "string"
                    },
                    logo: {
                        filetype: 'image/png'
                    },
                    cover: {
                        filetype: 'image/png'
                    },
                    created_at: "2017-05-03T12:53:25.117Z",
                    updated_at: "2017-05-03T12:53:25.117Z"
                };
            BrandService.edit(id, data).then(function(result) {
                expect(result).toBeDefined();
            });
        });

        describe('Brand dashboard controller', function() {

            var scope, controller, httpBackend;

            beforeEach(inject(function($controller, $rootScope, $httpBackend) {

                scope = $rootScope.$new();
                httpBackend = $httpBackend;

                controller = $controller('BrandController', {
                    $scope: scope,
                    $http: $httpBackend
                });
            }));

            it('should exist', function() {
                expect(controller).toBeDefined();
            });

        });

        describe('Brand add controller', function() {

            var scope, controller, httpBackend;

            beforeEach(inject(function($controller, $rootScope, $httpBackend) {

                scope = $rootScope.$new();
                httpBackend = $httpBackend;

                controller = $controller('BrandAddController', {
                    $scope: scope,
                    $http: $httpBackend
                });
            }));

            it('should exist', function() {
                expect(controller).toBeDefined();
            });

        });

        describe('Brand edit controller', function() {

            var scope, controller, httpBackend;

            beforeEach(inject(function($controller, $rootScope, $httpBackend) {

                scope = $rootScope.$new();
                httpBackend = $httpBackend;

                controller = $controller('BrandEditController', {
                    $scope: scope,
                    $http: $httpBackend
                });
            }));

            it('should exist', function() {
                expect(controller).toBeDefined();
            });

        });

        describe('Brand view controller', function() {

            var scope, controller, httpBackend;

            beforeEach(inject(function($controller, $rootScope, $httpBackend) {

                scope = $rootScope.$new();
                httpBackend = $httpBackend;

                controller = $controller('BrandViewController', {
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
