(function() {
    'use strict';

    angular
        .module('app')
        .directive('breadCrumbs', breadCrumbs);

    breadCrumbs.$inject = ['$state', '$stateParams', 'BreadCrumbService'];
    /* @ngInject */
    function breadCrumbs($state, $stateParams, BreadCrumbService) {

        var directive = {
            restrict: 'E',
            templateUrl: '/app/common/breadcrumbs.html',
            replace: true,
            // compile: function(tElement, tAttrs) {
            //     return function($scope, $elem, $attr) {

            //         $scope.states = BreadCrumbService.getCrumbs();

            //         $scope.show = function() {

            //             if ($scope.states.length == 0) {
            //                 return false;
            //             }

            //             return true;
            //         };

            //         $scope.$watch(BreadCrumbService.getCrumbs(), function() {
            //             $log.log('crumb test');
            //         });
            //     }
            // }
        };

        return directive;
    }

})();