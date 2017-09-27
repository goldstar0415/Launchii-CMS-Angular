(function() {
    'use strict';

    angular
        .module('app')
        .filter('ucFirst', ucFirst);

    function ucFirst() {
        return function(string) {
            if (string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }

            return string;
        }

    }

})();