(function() {
    'use strict';

    describe('Categories service', function() {
        var $controller, CategoryService;

        beforeEach(angular.mock.module('ui.router'));
        beforeEach(angular.mock.module('app.categories'));

        beforeEach(function() {

            module(function($provide) {
                $provide.value('CONST', jasmine.createSpy('CONST'));
                $provide.value('categoryPrepService', { categories: [] });
                $provide.value('HelperService', { getPrevState: jasmine.createSpy('getPrevState') });
                $provide.value('prepSelCategory', jasmine.createSpy('prepSelCategory'));
            });

        });

        beforeEach(inject(function(_CategoryService_) {
            CategoryService = _CategoryService_;
        }));

        it('should exist', function() {
            expect(CategoryService).toBeDefined();
        });

        it('should have the required attributes', function() {
            expect(CategoryService.getAll).toBeDefined();
            expect(CategoryService.search).toBeDefined();
            expect(CategoryService.lists).toBeDefined();
            expect(CategoryService.add).toBeDefined();
            expect(CategoryService.edit).toBeDefined();
            expect(CategoryService.delete).toBeDefined();
            expect(CategoryService.find).toBeDefined();
        });

        it('should get all categories', function() {
            CategoryService.getAll().then(function(result) {
                expect(result).toBeDefined();
            });
        });

        it('should add a category', function() {
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

            CategoryService.add(data).then(function(result) {
                expect(result).toBeDefined();
            });
        });

        it('should edit a category', function() {
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
            CategoryService.edit(id, data).then(function(result) {
                expect(result).toBeDefined();
            });
        });

        describe('Category dashboard controller', function() {

            var scope, controller, httpBackend;

            beforeEach(inject(function($controller, $rootScope, $httpBackend) {

                scope = $rootScope.$new();
                httpBackend = $httpBackend;

                controller = $controller('CategoryController', {
                    $scope: scope,
                    $http: $httpBackend
                });
            }));

            it('should exist', function() {
                expect(controller).toBeDefined();
            });

        });

        describe('Category add controller', function() {

            var scope, controller, httpBackend;

            beforeEach(inject(function($controller, $rootScope, $httpBackend) {

                scope = $rootScope.$new();
                httpBackend = $httpBackend;

                controller = $controller('CategoryAddController', {
                    $scope: scope,
                    $http: $httpBackend
                });
            }));

            it('should exist', function() {
                expect(controller).toBeDefined();
            });

        });

        describe('Category edit controller', function() {

            var scope, controller, httpBackend;

            beforeEach(inject(function($controller, $rootScope, $httpBackend) {

                scope = $rootScope.$new();
                httpBackend = $httpBackend;

                controller = $controller('CategoryEditController', {
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