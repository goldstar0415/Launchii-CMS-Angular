

(function() {
    'use strict';

    angular.module('app.auth')
        .factory('PasswordResetService', PasswordResetService);

    PasswordResetService.$inject = ['$rootScope', '$q', '$state', 'CONST', '$log', '$http'];

    /* @ngInject */
    function PasswordResetService($rootScope, $q, $state, CONST, $log, $http) {
        var api = CONST.api_domain;

        var service = {
            validatePasswordResetToken: validatePasswordResetToken,
            validate: validate
        }

        return service;

        ////////////////

        function validatePasswordResetToken(reset_password_token) {
            var url = api + '/auth/passwords/validate_token';
            return $http.get(url + '?reset_password_token=' + reset_password_token);
        }

        function validate(passwords, reset_password_token) {
            
            var url = api + '/auth/passwords';
            return $http.patch(url, {
                reset_password_token: reset_password_token,
                user: passwords
            });
        }

    }

})();
