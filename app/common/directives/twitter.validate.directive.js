(function() {
    'use strict';

    angular
        .module('app')
        .directive('validateTwitterUrl', validateTwitterUrl);

    validateTwitterUrl.$inject = ['defaultErrorMessageResolver', '$state'];
    /* @ngInject */
    function validateTwitterUrl(defaultErrorMessageResolver) {
        defaultErrorMessageResolver.getErrorMessages().then(function(errorMessages) {
            errorMessages['twitter'] = 'Please enter a valid twitter url';
        });

        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                validateTwitterUrl: '=validateTwitterUrl'
            },
            link: function(scope, element, attributes, ngModel) {

                ngModel.$validators.twitter = function(modelValue) {
                  if (typeof modelValue === 'undefined') {
                    return false;
                  }
                  if (modelValue == null) {
                    return false;
                  }
                  var i = modelValue.indexOf("://twitter.com/");
                  return i > -1;
                };

                scope.$watch('twitter', function() {
                    ngModel.$validate();
                });
            }
        };
    }

})();
