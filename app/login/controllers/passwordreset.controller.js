(function() {
    'use strict';

    angular.module('app.auth')
        .controller('PasswordResetController', PasswordResetController);

    PasswordResetController.$inject = ['$state', '$rootScope', '$log', 'CONST', '$http', '$window', 'PasswordResetService', '$auth'];

    /* @ngInject */
    function PasswordResetController($state, $rootScope, $log, CONST, $http, $window, PasswordResetService, $auth) {
        var vm = this;

        vm.form = {};
        vm.tokenValidated = false;
        vm.validate = validate;
        vm.error = "";
        if($window.location.href.indexOf('reset_password_token') === -1) {
            $rootScope.loginError = 'Please request Password Reset Token Email from Forget Password Screen.';
            $state.go('auth');
        } else {
            vm.reset_password_token = $window.location.href.slice($window.location.href.indexOf('reset_password_token')).split('=')[1];
            PasswordResetService.validatePasswordResetToken(vm.confirmation_token)
            .then(function(resp) {
                vm.tokenValidated = true;
                $log.log("Password Reset Token validated");
            }).catch(function(err) {
                $log.log(err);
                $rootScope.loginError = err.data.errors ? err.data.errors[0] : 'Cannot validate Password Reset Token';
                $state.go('auth');
            });
        }


        ///////////

        function validate(){
            if(vm.form.password == undefined || vm.form.password_confirmation == undefined){
                return;
            }

            PasswordResetService.validate(vm.form, vm.reset_password_token)
            .then(function(resp) {
                // vm.tokenValidated = true;
                // $log.log("Confirm token validated");
                $auth.logUser(resp);
            }).catch(function(err) {
                $log.log(err);
                vm.error = err.data.errors[0];
            });
        }
    }
})();
