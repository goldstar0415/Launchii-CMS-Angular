(function() {
    'use strict';

    angular.module('app.auth')
        .controller('ForgotController', ForgotController);

    ForgotController.$inject = ['AuthService', '$state', '$rootScope', '$log'];

    /* @ngInject */
    function ForgotController(AuthService, $state, $rootScope, $log) {
        var vm = this;

        vm.form = {};
        vm.form.redirect_url = '';
        vm.toLogin = toLogin;
        vm.forgotPassword = forgotPassword;
        vm.sendingRequest = false;

        activate();

        ///////////

        function activate() {
            $rootScope.resetPasswordError = null;
            $rootScope.resetPasswordSuccess = null;
        }

        function toLogin() {
            $state.go('auth');
        }

        function forgotPassword() {
            if (vm.sendingRequest) {
                return;
            }

            vm.sendingRequest = true;
            $rootScope.resetPasswordError = null;
            $rootScope.resetPasswordSuccess = null;

            AuthService.requestReset(vm.form).then(function(resp) {
                $rootScope.resetPasswordSuccess = resp.data.message ? resp.data.message : 'Password Reset Email has sent successfuly. Please check your box';
                vm.sendingRequest = false;
            }).catch(function(err) {
                $rootScope.resetPasswordError = err.data.errors[0] ? err.data.errors : "Unknown errors are preventing from sending Password Reset Email.";
                vm.sendingRequest = false;
            });
        }
    }
})();
