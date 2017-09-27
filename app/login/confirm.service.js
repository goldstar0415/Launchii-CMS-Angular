(function() {
    'use strict';

    angular.module('app.auth')
        .factory('ConfirmService', ConfirmService);

    ConfirmService.$inject = ['$rootScope', '$q', '$state', 'CONST', '$log', '$http'];

    /* @ngInject */
    function ConfirmService($rootScope, $q, $state, CONST, $log, $http) {
        var api = CONST.api_domain;

        var service = {
            validateConfirmationToken: validateConfirmationToken,
            validate: validate
        }

        return service;

        ////////////////

        function validateConfirmationToken(confirmation_token) {
            var url = api + '/auth/confirmations/validate_token';
            return $http.get(url + '?confirmation_token=' + confirmation_token);
        }

        function validate(passwords, confirmation_token) {
            
            var url = api + '/auth/confirmations';
            return $http.patch(url, {
                confirmation_token: confirmation_token,
                user: passwords
            });
        }

    }

})();
