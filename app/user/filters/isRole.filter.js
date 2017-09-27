(function() {
    'use strict';

    angular
        .module('app.users')
        .filter('isRole', isRole);

    function isRole() {
        return function(user) {
            if (user) {
                if (user.is_admin) {
                    return 'Admin';
                }
                if (user.is_vendor) {
                    return 'Vendor';
                }
                if (user.is_customer) {
                    return 'Customer';
                }
            }

            return 'No Role';
        }

    }

})();