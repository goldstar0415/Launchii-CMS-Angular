(function() { 
    'use strict'; 
 
    angular 
        .module('app') 
        .directive('compareTo', compareTo); 
 
    compareTo.$inject = ['defaultErrorMessageResolver', '$state']; 
    /* @ngInject */ 
    function compareTo(defaultErrorMessageResolver) { 
        defaultErrorMessageResolver.getErrorMessages().then(function(errorMessages) { 
            errorMessages['compareTo'] = 'Please confirm your password correctly.'; 
        }); 
 
        return { 
            restrict: 'A', 
            require: 'ngModel', 
            scope: { 
                compareTo: '=compareTo' 
            }, 
            link: function(scope, element, attributes, ngModel) { 
 
                ngModel.$validators.compareTo = function(modelValue) { 
                    if (typeof modelValue === 'undefined') { 
                      return false; 
                    } 
                    if (modelValue == null) { 
                      return false; 
                    } 
                    return modelValue == scope.compareTo; 
                }; 
 
                scope.$watch('compareTo', function() { 
                    ngModel.$validate(); 
                }); 
            } 
        }; 
    } 
 
})(); 