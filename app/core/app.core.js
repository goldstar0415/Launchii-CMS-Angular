(function() {
    'use strict';
    var env = {};

    // Import variables if present (from env.js)
    if (window) {
        Object.assign(env, window.__env);
    }
})();

(function() {
    'use strict';

    angular.module('app.core', [
        'ngResource',
        'ui.router',
        'ng-token-auth',
        'jcs-autoValidate',
        'ngProgressLite',
        'angular-ladda',
        'ngFileUpload',
        'file-model',
        'naif.base64',
        'ngAnimate',
        'localytics.directives',
        'angularUtils.directives.dirPagination',
        'minicolors',
        'froala',
        'ui.bootstrap',
        'dndLists'
    ]);

})();
