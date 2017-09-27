(function() {
    'use strict';

    angular.module('app')
        .config(config)
        .run(run);

    config.$inject = ['$authProvider', '$resourceProvider', '$httpProvider', 'CONST', 'laddaProvider', '$logProvider', '$qProvider'];

    /* @ngInject */
    function config($authProvider, $resourceProvider, $httpProvider, CONST, laddaProvider, $logProvider, $qProvider) {

        // Settings
        $logProvider.debugEnabled(CONST.env.enableDebug);

        // $qProvider.errorOnUnhandledRejections(false);

        $authProvider.configure({
            apiUrl:                  CONST.api_domain,
            validateOnPageLoad:      false,
            handleLoginResponse: function(response) {
                return response.user;
            },
            handleTokenValidationResponse: function(response) {
                return response.user;
            }
        });

        $resourceProvider.defaults.stripTrailingSlashes = false;
        laddaProvider.setOption({
            style: 'expand-right'
        });

    }

    run.$inject = ['$rootScope', '$state', 'AuthService', 'ngProgressLite', 'BreadCrumbService', '$location', '$window', '$auth'];
    /* @ngInject */
    function run($rootScope, $state, AuthService, ngProgressLite, BreadCrumbService, $location, $window, $auth) {

        var forceSSL = forceSSL;

        $rootScope.$on('$stateChangeStart', function(event, toState) {

            // Do not run forceSSL() on local
            var __page_url = $location.absUrl();
            var __is_local = ((__page_url.indexOf('localhost') > -1) ||
                (__page_url.indexOf('127.0.0.1') > -1));
            if (!__is_local)
                forceSSL(event);

            var stateName = toState.name;

            ngProgressLite.start();

            if (toState.name === 'logout') {
                if (!$rootScope.currentUser) {
                    event.preventDefault();
                    $state.go('auth');
                    stateName = 'auth';
                    ngProgressLite.done();
                }
            } else if ((toState.name === 'account-confirmation') || (toState.name === 'account-password-reset')) {
                if ($rootScope.currentUser) {
                    event.preventDefault();
                    $state.go('dashboard');
                    stateName = 'dashboard';
                    ngProgressLite.done();
                }
            } else if (toState.name === 'forgot') {
                if ($rootScope.currentUser) {
                    event.preventDefault();
                    $state.go('dashboard');
                    stateName = 'dashboard';
                    ngProgressLite.done();
                }
            } else {
                if ($rootScope.currentUser) {
                    if (toState.name === 'auth') {
                        event.preventDefault();
                        $state.go('dashboard');
                        stateName = 'dashboard';
                        ngProgressLite.done();
                    }
                } else {
                    if ($rootScope.isAppLoaded && toState.name !== 'auth') {
                        event.preventDefault();
                        $state.go('auth');
                        stateName = 'auth';
                        ngProgressLite.done();
                    }
                }
            }

            if (stateName != 'auth' &&
                stateName != 'logout' &&
                stateName != 'forgot' &&
                stateName != 'account_confirmation' &&
                stateName != 'account_password_reset') {
                BreadCrumbService.set(stateName);
                $rootScope.crumbs = BreadCrumbService.getCrumbs();
            }
        });

        $rootScope.$on('$stateChangeSuccess', function(event, toState) {
            ngProgressLite.done();
        });

        $rootScope.$on('$stateChangeError', function(event, toState) {
            ngProgressLite.done();
        });

        $rootScope.$on('auth:login-success', function(event, user) {
            // if not admin, logout
            if (!user.is_admin) {
                AuthService.logout().then(function(resp) {
                }).catch(function(error) {
                });
                $rootScope.currentUser = null;
                $rootScope.loginError = 'You are not authorized to access admin pages.';
                return;
            }

            $rootScope.currentUser = user;
            $state.go('dashboard');
        });

        $rootScope.$on('auth:login-error', function(event, error) {
            $rootScope.loginError = (error == undefined || error == null || error.errors == undefined || error.errors.length <= 0) ? 'Something went wrong.' : error.errors[0];
            $rootScope.currentUser = null;
        });

        $rootScope.$on('auth:validation-success', function(event, user) {
            $rootScope.currentUser = user;
            $rootScope.isAppLoaded = true;
            if ($state.current.name == 'auth' ||
                $state.current.name == 'logout' ||
                $state.current.name == 'forgot' ||
                $state.current.name == 'account_confirmation' ||
                $state.current.name == 'account_password_reset') {
                $state.go('dashboard');
            }
        });

        $rootScope.$on('auth:validation-error', function(event, error) {
            $rootScope.currentUser = null;
            // validation error, go to login page
            $rootScope.isAppLoaded = true;
            $state.go('auth');
        });

        $rootScope.$on('auth:invalid', function(event, error) {
            $rootScope.currentUser = null;
            // validation error, go to login page
            $rootScope.isAppLoaded = true;
            $state.go('auth');
        });

        $rootScope.$on('auth:logout-success', function(event) {
            $rootScope.currentUser = null;
            $state.go('auth');
        });

        $rootScope.$on('auth:logout-error', function(event, error) {
            // force logout anyways
            $rootScope.currentUser = null;
            AuthService.invalidateTokens();
            $state.go('auth');
        });

        $rootScope.$on('auth:session-expired', function(event) {
            $rootScope.currentUser = null;
            // invalidate token
            AuthService.invalidateTokens();
            $rootScope.loginError = 'Session expired!';
            $rootScope.isAppLoaded = true;
            $state.go('auth');
        });

        /////////Methods Definitions///////////

        //Force redirect to https protocol
        function forceSSL(event) {
            if ($location.protocol() !== 'https') {
                event.preventDefault();
                $window.location.href = $location.absUrl().replace('http', 'https');
                return false;
            }
        };

        $rootScope.minicolorsSettings = {
            control: 'wheel',
            theme: 'bootstrap'
        };

        // Validate the user on page load
        $auth.validateUser();

    }
})();
