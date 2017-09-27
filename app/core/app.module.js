(function() {
    'use strict';

    angular.module('app', [
        /* Shared modules */
        'app.core',

        /* Features */
        'app.auth',
        'app.helpers',
        'app.brands',
        'app.categories',
        'app.deals',
        'app.users',
        'app.rocketDeals',
        'app.superblocks'
    ]);
})();
