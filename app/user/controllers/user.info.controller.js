(function() {
    'use strict';

    angular.module('app.users')
        .controller('UserInfoController', UserInfoController);

    UserInfoController.$inject = ['UserService', '$scope', 'prepCurUser', 'HelperService', '$state', '$log'];

    /* @ngInject */
    function UserInfoController(UserService, $scope, prepCurUser, HelperService, $state, $log) {
        var vm = this;

        vm.mode = "Edit";
        vm.response = {};
        vm.selectedUser = prepCurUser;
        vm.form = vm.selectedUser;
        vm.defaultRole = vm.selectedUser.role;
        vm.defaultStatus = vm.selectedUser.is_active ? 'active' : 'inactive';
        vm.isDone = true;

        vm.prevState = HelperService.getPrevState();
        vm.submitAction = editPost;

        activate();

        ///////////////////

        function activate() {
            vm.form.password = '';
            vm.form.confirm_password = '';
        }

        function editPost() {
            vm.isDone = false;
            var editReq = {};
            if(vm.form.password.length){
                editReq = {
                    name: vm.form.name,
                    email: vm.form.email,
                    password: vm.form.password,
                    password_confirmation: vm.form.confirm_password
                }
            } else {
                editReq = {
                    name: vm.form.name,
                    email: vm.form.email
                }
            }
            UserService.editMe(vm.selectedUser.uid, editReq).then(function() {
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
                vm.isDone = true;

                HelperService.goToAnchor('msg-info');
            });
        }
    }
})();
