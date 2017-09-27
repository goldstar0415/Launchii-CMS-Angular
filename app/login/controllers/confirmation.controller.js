(function() {
    'use strict';

    angular.module('app.auth')
        .controller('ConfirmationController', ConfirmationController);

    ConfirmationController.$inject = ['$state', '$rootScope', '$log', 'CONST', '$http', '$window', 'ConfirmService', '$auth'];

    /* @ngInject */
    function ConfirmationController($state, $rootScope, $log, CONST, $http, $window, ConfirmService, $auth) {
        var vm = this;

        vm.form = {};
        vm.tokenValidated = false;
        vm.validate = validate;
        vm.error = "";

        if($window.location.href.indexOf('confirmation_token') === -1) {
             $state.go('auth');
        } else {
            vm.confirmation_token = $window.location.href.slice($window.location.href.indexOf('confirmation_token')).split('=')[1];
            ConfirmService.validateConfirmationToken(vm.confirmation_token)
            .then(function(resp) {
                vm.tokenValidated = true;
                $log.log("Confirm token validated");
            }).catch(function(err) {
                $log.log(err);
                $rootScope.loginError = err.data.errors[0];
                $state.go('auth');
            });
        }

        ///////////

        function validate(){
            if(vm.form.password == undefined || vm.form.password_confirmation == undefined){
                return;
            }

            ConfirmService.validate(vm.form, vm.confirmation_token)
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
