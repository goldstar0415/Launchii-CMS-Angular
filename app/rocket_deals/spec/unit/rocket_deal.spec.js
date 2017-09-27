(function() {
    'use strict';

    describe('Rocket Deals service', function() {
        var $controller, RocketDealService, UserService, DealService;

        beforeEach(angular.mock.module('ui.router'));
        beforeEach(angular.mock.module('app.users'));
        beforeEach(angular.mock.module('app.deals'));
        beforeEach(angular.mock.module('app.rocketDeals'));

        beforeEach(function() {

            module(function($provide) {
                $provide.value('CONST', jasmine.createSpy('CONST'));
                $provide.value('HelperService', { getPrevState: jasmine.createSpy('getPrevState') });
                $provide.value('prepSelRocketDeal', jasmine.createSpy('prepSelRocketDeal'));
                $provide.value('DealService', jasmine.createSpy('RocketDealService'));
            });

        });

        beforeEach(inject(function(_UserService_) {
            UserService = _UserService_;
        }));

        beforeEach(inject(function(_DealService_) {
            DealService = _DealService_;
        }));

        beforeEach(inject(function(_RocketDealService_) {
            RocketDealService = _RocketDealService_;
        }));

        it('should exist', function() {
            expect(RocketDealService).toBeDefined();
        });

        it('should have the required attributes', function() {
            expect(RocketDealService.search).toBeDefined();
            expect(RocketDealService.add).toBeDefined();
            expect(RocketDealService.edit).toBeDefined();
            expect(RocketDealService.delete).toBeDefined();
            expect(RocketDealService.getById).toBeDefined();
            expect(RocketDealService.approve).toBeDefined();
            expect(RocketDealService.reject).toBeDefined();
        });

        it('should search rocket deals', function() {
            RocketDealService.search('', '', '', 1, 10).then(function(result) {
                expect(result).toBeDefined();
            });
        });

        it('should add a rocket deal', function() {
            var data =
                {
                    name: "string",
                    deal_id: "string",
                    vendor_id: "string",
                    start_at: "2017-05-03T12:53:25.117Z",
                    end_at: "2017-05-03T12:53:25.117Z",
                    discount_attributes: {
                        value: "string",
                        codes_txt: "string",
                        codes_expire_at: "2017-05-03T12:53:25.117Z"
                    }
                }

            RocketDealService.add(data).then(function(result) {
                expect(result).toBeDefined();
            });
        });

        it('should edit a rocket deal', function() {
            var id = "1234567890";
            var data =
                {
                    name: "string",
                    deal_id: "string",
                    vendor_id: "string",
                    start_at: "2017-05-03T12:53:25.117Z",
                    end_at: "2017-05-03T12:53:25.117Z",
                    discount_attributes: {
                        value: "string",
                        codes_txt: "string",
                        codes_expire_at: "2017-05-03T12:53:25.117Z"
                    }
                };
            RocketDealService.edit(id, data).then(function(result) {
                expect(result).toBeDefined();
            });
        });

        describe('Rocket Deal dashboard controller', function() {

            var scope, controller, httpBackend;

            beforeEach(inject(function($controller, $rootScope, $httpBackend) {

                scope = $rootScope.$new();
                httpBackend = $httpBackend;

                controller = $controller('RocketDealController', {
                    $scope: scope,
                    $http: $httpBackend
                });
            }));

            it('should exist', function() {
                expect(controller).toBeDefined();
            });

        });

        describe('RocketDeal add controller', function() {

            var scope, controller, httpBackend;

            beforeEach(inject(function($controller, $rootScope, $httpBackend) {

                scope = $rootScope.$new();
                httpBackend = $httpBackend;

                controller = $controller('RocketDealAddController', {
                    $scope: scope,
                    $http: $httpBackend
                });
            }));

            it('should exist', function() {
                expect(controller).toBeDefined();
            });

        });

        describe('RocketDeal edit controller', function() {

            var scope, controller, httpBackend;

            beforeEach(inject(function($controller, $rootScope, $httpBackend) {

                scope = $rootScope.$new();
                httpBackend = $httpBackend;

                controller = $controller('RocketDealEditController', {
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
