(function() {
    'use strict';

    angular
        .module('app')
        .filter('isEmpty', isEmpty);

    function isEmpty() {
        return function(container) {

            if (angular.isObject(container)) {

                angular.forEach(container, function(item, index) {
                    return false;
                });

            } else if (angular.isArray(container)) {
                return container.length == 0;
            }

            return true;
        }

    }

})();