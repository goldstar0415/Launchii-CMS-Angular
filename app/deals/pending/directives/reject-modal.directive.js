(function() {
    'use strict';

    angular
        .module('app.deals')
        .directive('rejectDealModal', rejectDealModal);

    rejectDealModal.$inject = ['$rootScope', 'HelperService', '$filter'];
    /* @ngInject */
    function rejectDealModal($rootScope, HelperService, $filter) {

        var directive = {
            restrict: 'E',
            templateUrl: '/app/deals/pending/reject-deal-modal.html',
            replace: true,
            scope: {
            },
            transclude: true,
            link: function(scope, element, attrs) {
                scope.rejectDeal = rejectDeal;
                init();
                element.on("hidden.bs.modal", function() {

                });

                /////////////

                function init() {
                    scope.reject_reason = '';
                }

                function rejectDeal() {
                    scope.$parent.vm.rejectDeal(scope.reject_reason);                    
                }
            }
        };

        return directive;
    }

})();
