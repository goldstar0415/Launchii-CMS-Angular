(function() {
    'use strict';

    angular.module('app.categories')
        .controller('CategoryEditController', CategoryEditController);

    CategoryEditController.$inject = ['CategoryService', '$stateParams', '$scope', 'prepSelCategory', 'HelperService', '$state', '$log'];

    /* @ngInject */
    function CategoryEditController(CategoryService, $stateParams, $scope, prepSelCategory, HelperService, $state, $log) {
        var vm = this;

        vm.mode = "Edit";
        vm.response = {};
        vm.categoryId = $stateParams.id;
        vm.selectedCategory = prepSelCategory;
        vm.form = vm.selectedCategory;
        vm.isDone = true;


        vm.prevState = HelperService.getPrevState();
        vm.submitAction = editPost;

        activate();

        ///////////////////

        function activate() {
        }

        function editPost() {
            vm.isDone = false;

            CategoryService.edit(vm.categoryId, vm.form).then(function() {
                vm.response['success'] = "alert-success";
                vm.response['alert'] = "Success!";
                vm.response['msg'] = "Updated category: " + vm.form.name;
                vm.isDone = true;

                $scope.$parent.vm.isDone = true;
                $scope.$parent.vm.response = vm.response;
                $scope.$parent.vm.getCategories();
                $state.go(vm.prevState);

            }).catch(function(err) {
                $log.log(err);
                vm.response['success'] = "alert-danger";
                vm.response['alert'] = "Error!";
                vm.response['msg'] = "Failed to update Category.";
                vm.response['error_arr'] = err.data == null ? '' : err.data.errors;
                vm.isDone = true;

                $scope.$parent.vm.isDone = true;
                HelperService.goToAnchor('msg-info');
            });
        }
    }
})();
