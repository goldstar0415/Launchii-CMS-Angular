(function() {
    'use strict';

    angular.module('app.users')
        .controller('UserEditController', UserEditController);

    UserEditController.$inject = ['UserService', '$stateParams', '$scope', 'prepSelUser', 'HelperService', '$state', '$log'];

    /* @ngInject */
    function UserEditController(UserService, $stateParams, $scope, prepSelUser, HelperService, $state, $log) {
        var vm = this;

        vm.mode = "Edit";
        vm.response = {};
        vm.userId = $stateParams.id;
        vm.selectedUser = prepSelUser;
        vm.form = {
                name: vm.selectedUser.name, 
                email: vm.selectedUser.email, 
                role: vm.selectedUser.role, 
                status: vm.selectedUser.status, 
                subscription_status: vm.selectedUser.subscription_status
        };

        vm.defaultRole = vm.selectedUser.role;
        vm.defaultStatus = vm.selectedUser.is_active ? 'active' : 'inactive';
        vm.defaultSubscriptionStatus = vm.selectedUser.is_free ? 'free' : 'paid';
        vm.isDone = true;

        vm.prevState = HelperService.getPrevState();
        vm.submitAction = editPost;

        //activate();

        ///////////////////

        function activate() {
        }

        function editPost() {
            vm.isDone = false;
            UserService.edit(vm.userId, vm.form).then(function() {
                vm.response['success'] = "alert-success";
                vm.response['alert'] = "Success!";
                vm.response['msg'] = "Updated user: " + vm.form.name;
                vm.isDone = true;

                $scope.$parent.vm.search();
                $state.go(vm.prevState);

            }).catch(function(err) {
                $log.log(err);
                vm.response['success'] = "alert-danger";
                vm.response['alert'] = "Error!";
                vm.response['msg'] = "Failed to update User.";
                vm.response['error_arr'] = err.data == null ? '' : err.data.errors;
                vm.isDone = true;

                HelperService.goToAnchor('msg-info');
            });
        }
    }
})();
