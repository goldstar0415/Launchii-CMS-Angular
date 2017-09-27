(function() {
    'use strict';

    angular
        .module('app')
        .directive('stringToNumber', stringToNumber);

    function stringToNumber() {
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, ngModel) {
                ngModel.$parsers.push(function(value) {
                    if (!angular.isDefined(value) || value == null) {
                        return '';
                    } else {
                        return '' + value;
                    }
                });
                ngModel.$formatters.push(function(value) {
                    return parseFloat(value);
                });
            }
        };
    }

})();
