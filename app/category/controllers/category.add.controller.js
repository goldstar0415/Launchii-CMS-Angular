(function() {
    'use strict';

    angular.module('app.categories')
        .controller('CategoryAddController', CategoryAddController);

    CategoryAddController.$inject = ['CategoryService', '$scope', 'HelperService', '$state', '$log'];

    /* @ngInject */
    function CategoryAddController(CategoryService, $scope, HelperService, $state, $log) {
        var vm = this;

        vm.mode = "Add";
        vm.form = {};
        vm.response = {};
        vm.isDone = true;

        vm.prevState = HelperService.getPrevState();
        vm.submitAction = addCategory;

        ///////////////////

        function addCategory() {
            vm.isDone = false;

            CategoryService.add(vm.form).then(function() {
                vm.response['success'] = "alert-success";
                vm.response['alert'] = "Success!";
                vm.response['msg'] = "Added category: " + vm.form.name;
                vm.isDone = true;

                $scope.$parent.vm.isDone = true;
                $scope.$parent.vm.response = vm.response;
                $scope.$parent.vm.getCategories();
                $state.go(vm.prevState);

            }).catch(function(err) {
                vm.response['success'] = "alert-danger";
                vm.response['alert'] = "Error!";
                vm.response['msg'] = "Failed to add new Category.";
                vm.response['error_arr'] = err.data == null ? '' : err.data.errors;
                vm.isDone = true;

                $scope.$parent.vm.isDone = true;
                HelperService.goToAnchor('msg-info');
            });
        }
    }
})();
