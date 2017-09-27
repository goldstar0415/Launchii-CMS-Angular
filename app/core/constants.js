(function() {
    'use strict';

    angular.module('app')
        .constant('CONST', {
            api_domain: angular.injector(['ng']).get('$window').__env.apiUrl,
            env: angular.injector(['ng']).get('$window').__env
        });

})();