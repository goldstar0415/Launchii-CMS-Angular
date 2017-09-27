(function() {
    'use strict';

    angular
        .module('app.deals')
        .filter('numberToString', numberToString);

    function numberToString() {
        return function(number) {
            if (angular.isDefined(number) && number != null) {
                if (typeof number === 'number') {
                    return number.toString();
                } else if (typeof number === 'string') {
                    if (number.trim() == '') {
                        return '0';
                    } else {
                        return number;
                    }
                } else {
                    return '0';
                }
            }
            return '0';
        }
    }

})();
