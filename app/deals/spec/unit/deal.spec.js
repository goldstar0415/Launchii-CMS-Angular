(function() {
    'use strict';

    describe('Deals service', function() {
        var $controller, DealService, UserService, BrandService;

        beforeEach(angular.mock.module('ui.router'));
        beforeEach(angular.mock.module('app.deals'));
        beforeEach(angular.mock.module('app.users'));

        beforeEach(function() {

            module(function($provide) {
                $provide.value('CONST', jasmine.createSpy('CONST'));
                $provide.value('brandPrepService', { brands: [] });
                $provide.value('categoryPrepService', { categories: [] });
                $provide.value('HelperService', { getPrevState: jasmine.createSpy('getPrevState') });
                $provide.value('prepDealType', jasmine.createSpy('prepDealType'));
                $provide.value('prepSelBrand', jasmine.createSpy('prepSelBrand'));
                $provide.value('BrandService', jasmine.createSpy('DealService'));
                $provide.value('CategoryService', jasmine.createSpy('DealService'));
                $provide.value('prepTemplateNames', jasmine.createSpy('prepTemplateNames'));
                $provide.value('prepTemplateTypes', jasmine.createSpy('prepTemplateNames'));
                $provide.value('prepSelDeal', jasmine.createSpy('prepSelDeal'));
                $provide.value('prepSelVariants', jasmine.createSpy('prepSelVariants'));
                $provide.value('prepSelTemplates', jasmine.createSpy('prepSelTemplates'));
                $provide.value('prepActiveStandardD', jasmine.createSpy('prepActiveStandardD'));
                $provide.value('prepDealImages', jasmine.createSpy('prepDealImages'));
                $provide.value('prepDealVideos', jasmine.createSpy('prepDealVideos'));
            });

        });

        beforeEach(inject(function(_UserService_) {
            UserService = _UserService_;
        }));

        it('should exist', function() {
            expect(UserService).toBeDefined();
        });

        beforeEach(inject(function(_DealService_) {
            DealService = _DealService_;
        }));

        it('should exist', function() {
            expect(DealService).toBeDefined();
        });

        it('should have the required attributes', function() {
            expect(DealService.search).toBeDefined();
            expect(DealService.add).toBeDefined();
            expect(DealService.edit).toBeDefined();
            expect(DealService.delete).toBeDefined();
            expect(DealService.getById).toBeDefined();
            expect(DealService.approve).toBeDefined();
            expect(DealService.reject).toBeDefined();
        });

        beforeEach(inject(function(_BrandService_) {
            BrandService = _BrandService_;
        }));

        it('should exist', function() {
            expect(BrandService).toBeDefined();
        });

        describe('Deal dashboard controller', function() {

            var scope, DealController, httpBackend;

            beforeEach(inject(function($controller, $rootScope, $httpBackend) {

                scope = $rootScope.$new();
                httpBackend = $httpBackend;

                DealController = $controller('DealController', {
                    $scope: scope,
                    $http: $httpBackend
                });
            }));

            it('should exist', function() {
                expect(DealController).toBeDefined();
            });

            it('should have the required attributes', function() {
                expect(DealController.deals).toBeDefined();
                expect(DealController.response).toBeDefined();
                expect(DealController.deleteDeal).toBeDefined();
                expect(DealController.search).toBeDefined();
                expect(DealController.clearSearch).toBeDefined();
            });

        });

        describe('Deal pending controller', function() {

            var scope, DealPendingController, httpBackend;

            beforeEach(inject(function($controller, $rootScope, $httpBackend) {

                scope = $rootScope.$new();
                httpBackend = $httpBackend;

                DealPendingController = $controller('DealPendingController', {
                    $scope: scope,
                    $http: $httpBackend
                });
            }));

            it('should exist', function() {
                expect(DealPendingController).toBeDefined();
            });

            it('should have the required attributes', function() {
                expect(DealPendingController.search).toBeDefined();
                expect(DealPendingController.startSearch).toBeDefined();
                expect(DealPendingController.clearSearch).toBeDefined();
            });

        });

        describe('Deal add controller', function() {

            var scope, controller, httpBackend;

            beforeEach(inject(function($controller, $rootScope, $httpBackend) {

                scope = $rootScope.$new();
                httpBackend = $httpBackend;

                controller = $controller('DealAddController', {
                    $scope: scope,
                    $http: $httpBackend
                });
            }));

            it('should exist', function() {
                expect(controller).toBeDefined();
            });

        });

        describe('Deal edit controller', function() {

            var scope, controller, httpBackend;

            beforeEach(inject(function($controller, $rootScope, $httpBackend) {

                scope = $rootScope.$new();
                httpBackend = $httpBackend;

                controller = $controller('DealEditController', {
                    $scope: scope,
                    $http: $httpBackend
                });
            }));

            it('should exist', function() {
                expect(controller).toBeDefined();
            });

        });

        describe('Deal view controller', function() {

            var scope, controller, httpBackend;

            beforeEach(inject(function($controller, $rootScope, $httpBackend) {

                scope = $rootScope.$new();
                httpBackend = $httpBackend;

                controller = $controller('DealViewController', {
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
