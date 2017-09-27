(function() {
    'use strict';

    angular.module('app.users')
        .controller('UserController', UserController);

    UserController.$inject = ['UserService', '$timeout', '$scope', '$log'];

    /* @ngInject */
    function UserController(UserService, $timeout, $scope, $log) {
        var vm = this;

        vm.response = {};
        vm.isLoading = false;

        vm.searchTerm = '';
        vm.filterUserRole = '';

        vm.currPage = 1;
        vm.totalUsers = 0;
        vm.usersPerPage = "10";
        vm.users = [];

        vm.search = search;
        vm.startSearch = startSearch;
        vm.clearSearch = clearSearch;
        vm.deleteUser = deleteUser;

        activate();

        ////////////////

        function activate() {
            startSearch();
        }

        function startSearch() {
            vm.currPage = 1;
            search();
        }

        function clearSearch() {
            vm.searchTerm = '';
            startSearch();
        }

        $scope.$watch('vm.filterUserRole', function(newValue, oldValue) {
            if (newValue == oldValue) {
                return;
            }
            startSearch();
        });

        function search() {
            vm.users = [];
            vm.isLoading = true;
            vm.searchTerm = vm.searchTerm.trim();

            UserService.search(vm.searchTerm, vm.filterUserRole, vm.currPage, vm.usersPerPage).then(function(resp) {
                vm.users = resp.users;
                vm.totalUsers = resp.total;
                vm.isLoading = false;
            }).catch(function(err) {
                $log.log(err);
                vm.isLoading = false;
            });
        }

        function deleteUser(element, user) {
            bootbox.confirm({
                title: "Confirm Delete",
                message: "Are you sure you want to delete user: <b>" + user.name + "</b>?",
                buttons: {
                    confirm: {
                        label: 'Yes',
                        className: 'btn-success'
                    },
                    cancel: {
                        label: 'No',
                        className: 'btn-danger'
                    }
                },
                callback: function(result) {
                    if (result) {
                        Ladda.create(element).start();
                        doDelete(user);
                    }
                }
            });

        }

        function doDelete(user) {
            UserService.delete(user.uid).then(function(resp) {
                vm.response['success'] = "alert-success";
                vm.response['alert'] = "Success!";
                vm.response['msg'] = "Deleted user: " + user.name;
                search();
                $timeout(function() {
                    vm.response.msg = null;
                }, 3000);
            }).catch(function() {
                vm.response['success'] = "alert-danger";
                vm.response['alert'] = "Error!";
                vm.response['msg'] = "Failed to delete user: " + user.name;
            });
        }
    }
})();
