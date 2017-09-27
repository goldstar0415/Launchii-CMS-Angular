(function() {
    'use strict';

    angular
        .module('app.users')
        .filter('isSuperAdmin', isSuperAdmin);

    function isSuperAdmin() {
        return function(user) {
            if (user) {
                if (user.email == 'admin@example.com') {
                    return true;
                }

            }

            return false;
        }

    }

})();