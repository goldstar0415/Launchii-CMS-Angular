(function() {
    'use strict';

    angular.module('app.users')
        .controller('UserViewController', UserViewController);

    UserViewController.$inject = ['UserService', '$stateParams', 'prepSelUser', 'HelperService', '$log'];

    /* @ngInject */
    function UserViewController(UserService, $stateParams, prepSelUser, HelperService, $log) {
        var vm = this;

        vm.mode = "View";
        vm.response = {};
        vm.userId = $stateParams.id;
        vm.user = prepSelUser;
        vm.isDone = true;
        vm.prevState = HelperService.getPrevState();

        vm.sendConfirmationEmail = sendConfirmationEmail;

        //activate();

        ///////////////////

        function activate() {
        }

        function sendConfirmationEmail(elem) {
            var ladda = Ladda.create(elem);
            ladda.start();

            UserService.send_confirm(vm.user.uid).then(function(resp) {
                vm.response['success'] = "alert-success";
                vm.response['alert'] = "Success!";
                vm.response['msg'] = "Sent the confirmation email to " + vm.user.email;

                vm.isDone = true;
                ladda.stop();
            }).catch(function(err) {
                $log.log(err);
                vm.response['success'] = "alert-danger";
                vm.response['alert'] = "Error!";
                vm.response['msg'] = "Failed to send confirmation email.";
                vm.response['error_arr'] = err.data == null ? '' : err.data.errors;

                vm.isDone = true;
                HelperService.goToAnchor('msg-info');
                ladda.stop();
            });
        }
    }
})();
