(function() {
    'use strict';

    angular
        .module('app')
        .directive('clearImageInput', clearImageInput);

    clearImageInput.$inject = ['$state', '$stateParams', 'BreadCrumbService'];
    /* @ngInject */
    function clearImageInput($state, $stateParams, BreadCrumbService) {

        var directive = {
            restrict: 'A',
            scope: {
                selModel: '=',
                elemContainer: '@'
            },
            link: function(scope, element, attrs) {

                clearEvent();

                /////////////

                function clearEvent() {
                    element.bind('click', function() {
                        scope.selModel.file = null;
                        scope.selModel.file = "";
                        angular.element(scope.elemContainer).html('');
                    });
                }

            }
        };

        return directive;
    }

})();