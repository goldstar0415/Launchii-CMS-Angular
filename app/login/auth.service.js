(function() {
    'use strict';

    angular.module('app.auth', [])
        .factory('AuthService', AuthService);

    AuthService.$inject = ['$auth', '$rootScope', '$q', '$state', 'CONST', '$log'];

    /* @ngInject */
    function AuthService($auth, $rootScope, $q, $state, CONST, $log) {
        var api = CONST.api_domain;

        var service = {
            login: login,
            logout: logout,
            userIsAuthenticated: userIsAuthenticated,
            currentUser: currentUser,
            tokenExists: tokenExists,
            invalidateTokens: invalidateTokens,
            requestReset: requestReset
        }

        return service;

        ////////////////

        function userIsAuthenticated() {
            return $auth.userIsAuthenticated();
        }

        function currentUser() {
            return $auth.user;
        }

        function tokenExists() {
            return (!$auth.retrieveData('auth_headers') ? false : true);
        }

        function invalidateTokens() {
            $auth.invalidateTokens();
        }

        function login(credentials) {
            var d = $q.defer();

            $auth.submitLogin(credentials).then(function(resp) {
                d.resolve(resp);
            }).catch(function(err) {
                $log.log(err);
                d.reject(err);
            });

            return d.promise;
        }

        function requestReset(params) {
            var d = $q.defer();

            $auth.requestPasswordReset(params).then(function(resp) {
                d.resolve(resp);
            }).catch(function(err) {
                $log.log(err);
                d.reject(err);
            });

            return d.promise;
        }

        function logout() {
            var d = $q.defer();

            $auth.signOut().then(function(resp) {
                d.resolve(resp);
            }).catch(function(err) {
                $log.log(err);
                d.reject(err);
            });

            return d.promise;
        }

    }

})();
