(function() {
    'use strict';

    angular.module('app.auth')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['AuthService', '$state', '$rootScope'];

    /* @ngInject */
    function LoginController(AuthService, $state, $rootScope) {
        var vm = this;

        vm.form = {};
        vm.login = login;
        vm.loggingIn = false;
        vm.toForgot = toForgot;

        activate();

        ///////////

        function activate() {
        }

        function toForgot() {
            $state.go('forgot');
        }

        function login() {
            if(vm.form.email == undefined || vm.form.password == undefined){
                return;
            }

            if (vm.loggingIn) {
                return;
            }

            vm.loggingIn = true;
            $rootScope.loginError = null;

            AuthService.login(vm.form).then(function(resp) {
                vm.loggingIn = false;
            }).catch(function(err) {
                vm.loggingIn = false;
            });
        }
    }
})();
