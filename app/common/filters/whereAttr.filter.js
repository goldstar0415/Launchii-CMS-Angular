(function() {
    'use strict';

    angular
        .module('app')
        .filter('whereAttr', whereAttr);

    function whereAttr() {
        return function(box, attr, value) {
            var obj = [];
            angular.forEach(box, function(item, index) {
                if (angular.isDefined(item[attr]) && item[attr] == value) {
                    obj.push(item);
                }
            });

            return obj;

        }

    }

})();