(function() {
    'use strict';

    angular
        .module('app')
        .directive('validateFacebookUrl', validateFacebookUrl);

    validateFacebookUrl.$inject = ['defaultErrorMessageResolver', '$state'];
    /* @ngInject */
    function validateFacebookUrl(defaultErrorMessageResolver) {
        defaultErrorMessageResolver.getErrorMessages().then(function(errorMessages) {
            errorMessages['facebook'] = 'Please enter a valid facebook url';
        });

        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                validateFacebookUrl: '=validateFacebookUrl'
            },
            link: function(scope, element, attributes, ngModel) {

                ngModel.$validators.facebook = function(modelValue) {
                    if (typeof modelValue === 'undefined') {
                      return false;
                    }
                    if (modelValue == null) {
                      return false;
                    }
                    var i = modelValue.indexOf("://facebook.com/");
                    return i > -1;
                };

                scope.$watch('facebook', function() {
                    ngModel.$validate();
                });
            }
        };
    }

})();
