(function() {
    'use strict';

    describe('Super Block service', function() {
        var $controller, SuperBlockService;

        beforeEach(angular.mock.module('ui.router'));
        beforeEach(angular.mock.module('app.superblocks'));

        beforeEach(function() {

            module(function($provide) {
                $provide.value('CONST', jasmine.createSpy('CONST'));
                $provide.value('HelperService', { getPrevState: jasmine.createSpy('getPrevState') });
                $provide.value('prepSelSuperBlock', jasmine.createSpy('prepSelSuperBlock'));
                $provide.value('froalaS3Info', {result: {}});
            });

        });

        beforeEach(inject(function(_SuperBlockService_) {
            SuperBlockService = _SuperBlockService_;
        }));

        it('should exist', function() {
            expect(SuperBlockService).toBeDefined();
        });

        it('should have the required attributes', function() {
            expect(SuperBlockService.search).toBeDefined();
            expect(SuperBlockService.add).toBeDefined();
            expect(SuperBlockService.edit).toBeDefined();
            expect(SuperBlockService.delete).toBeDefined();
            expect(SuperBlockService.getById).toBeDefined();
        });

        it('should search super blocks', function() {
            SuperBlockService.search('', '', 1, 10).then(function(result) {
                expect(result).toBeDefined();
            });
        });

        describe('Super Block dashboard controller', function() {

            var scope, controller, httpBackend;

            beforeEach(inject(function($controller, $rootScope, $httpBackend) {

                scope = $rootScope.$new();
                httpBackend = $httpBackend;

                controller = $controller('SuperBlockController', {
                    $scope: scope,
                    $http: $httpBackend
                });
            }));

            it('should exist', function() {
                expect(controller).toBeDefined();
            });

        });

        describe('Super Block add controller', function() {

            var scope, controller, httpBackend;

            beforeEach(inject(function($controller, $rootScope, $httpBackend) {

                scope = $rootScope.$new();
                httpBackend = $httpBackend;

                controller = $controller('SuperBlockAddController', {
                    $scope: scope,
                    $http: $httpBackend
                });
            }));

            it('should exist', function() {
                expect(controller).toBeDefined();
            });

        });

        describe('Super Block edit controller', function() {

            var scope, controller, httpBackend;

            beforeEach(inject(function($controller, $rootScope, $httpBackend) {

                scope = $rootScope.$new();
                httpBackend = $httpBackend;

                controller = $controller('SuperBlockEditController', {
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
