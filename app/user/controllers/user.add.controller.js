(function() {
    'use strict';

    angular.module('app.users')
        .controller('UserAddController', UserAddController);

    UserAddController.$inject = ['UserService', '$scope', 'HelperService', '$state', '$log'];

    /* @ngInject */
    function UserAddController(UserService, $scope, HelperService, $state, $log) {
        var vm = this;

        vm.mode = "Add";
        vm.response = {};
        vm.form = {};
        vm.defaultRole = 'admin';
        vm.defaultStatus = 'active';
        vm.defaultSubscriptionStatus = 'free';
        vm.isDone = true;

        vm.prevState = HelperService.getPrevState();
        vm.submitAction = addPost;

        //activate();

        ///////////////////

        function activate() {
        }

        function addPost() {
            vm.isDone = false;
            UserService.add(vm.form).then(function() {
                vm.response['success'] = "alert-success";
                vm.response['alert'] = "Success!";
                vm.response['msg'] = "Added new user: " + vm.form.name;
                vm.isDone = true;

                $scope.$parent.vm.search();
                $state.go(vm.prevState);

            }).catch(function(err) {
                $log.log(err);
                vm.response['success'] = "alert-danger";
                vm.response['alert'] = "Error!";
                vm.response['msg'] = "Failed to add user.";
                vm.response['error_arr'] = err.data == null ? '' : err.data.errors;
                vm.isDone = true;

                HelperService.goToAnchor('msg-info');
            });
        }
    }
})();
