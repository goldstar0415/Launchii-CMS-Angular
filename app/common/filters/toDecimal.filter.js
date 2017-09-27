(function() {
    'use strict';

    angular
        .module('app')
        .filter('toDecimal', toDecimal);

    function toDecimal() {
        return function(num, dec) {
            if (num) {
                num = parseFloat(num);
                num = num.toFixed(dec);

                return '' + num;
            }

            return num;
        }

    }

})();