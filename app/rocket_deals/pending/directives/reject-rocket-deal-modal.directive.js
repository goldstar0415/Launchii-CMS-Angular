(function() {
    'use strict';

    angular
        .module('app.rocketDeals')
        .directive('rejectRocketDealModal', rejectRocketDealModal);

    rejectRocketDealModal.$inject = ['$rootScope', 'HelperService', '$filter'];
    /* @ngInject */
    function rejectRocketDealModal($rootScope, HelperService, $filter) {

        var directive = {
            restrict: 'E',
            templateUrl: '/app/rocket_deals/pending/reject-rocket-deal-modal.html',
            replace: true,
            scope: {
            },
            transclude: true,
            link: function(scope, element, attrs) {
                scope.rejectRocketDeal = rejectRocketDeal;
                init();
                element.on("hidden.bs.modal", function() {

                });

                /////////////

                function init() {
                    scope.reject_reason = '';
                }

                function rejectRocketDeal() {
                    scope.$parent.vm.rejectRocketDeal(scope.reject_reason);
                }
            }
        };

        return directive;
    }

})();
