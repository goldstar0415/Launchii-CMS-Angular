(function() {
    'use strict';

    angular
        .module('app.deals')
        .filter('discountLabel', discountLabel);

    function discountLabel() {
        return function(discount) {
            if (angular.isDefined(discount) && discount != null) {
                if (discount.is_unit || discount.value_type == 'unit') {
                    return '$' + discount.value;
                } else if (discount.is_percentage || discount.value_type == 'percentage') {
                    return discount.value + '%';
                }
            }
            return '';
        }
    }

})();
