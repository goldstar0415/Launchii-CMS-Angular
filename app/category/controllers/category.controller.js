(function() {
    'use strict';

    angular.module('app.categories')
        .controller('CategoryController', CategoryController);

    CategoryController.$inject = ['CategoryService', '$log', '$timeout'];

    /* @ngInject */
    function CategoryController(CategoryService, $log, $timeout) {
        var vm = this;

        vm.categories = [];
        vm.getCategories = getCategories;
        vm.hasDeleted = false;
        vm.response = {};
        vm.deleteCategory = deleteCategory;
        vm.response = {};
        vm.isDone = false;
        vm.search = search;
        vm.searchItem = '';
        vm.isLoading = false;
        vm.isRetrieving = false;
        vm.isSearch = false;
        vm.clearSearch = clearSearch;
        vm.isCategoryEmpty = isCategoryEmpty;

        activate();

        ////////////////

        function activate() {
            return getCategories();
        }

        function isCategoryEmpty() {
            return vm.categories.length == 0;
        }

        function clearSearch() {
            vm.searchItem = '';
            search();
        }

        function search() {
            vm.isLoading = true;

            if (vm.searchItem.trim().length > 0) {
                vm.isSearch = true;
            } else {
                vm.isSearch = false;
            }

            CategoryService.search(vm.searchItem, 'active').then(function(resp) {
                vm.categories = resp;
                vm.isLoading = false;
            }).catch(function(err) {
                $log.log(err);
            });
        }

        function getCategories() {
            vm.isRetrieving = true;
            return CategoryService.search('', 'active').then(function(data) {
                vm.categories = data;
                vm.isRetrieving = false;
                $timeout(function() {
                    vm.response.msg = false;
                }, 3000);
                return vm.categories;
            });
        }

        function deleteCategory(element, category) {
            bootbox.confirm({
                title: "Confirm Delete",
                message: "Are you sure you want to delete category: <b>" + category.name + "</b>?",
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
                        var ladda = Ladda.create(element);
                        ladda.start();
                        if (!doDelete(category)) {
                            ladda.stop();
                        }
                    }
                }
            });

        }

        function doDelete(category) {
            CategoryService.delete(category.uid).then(function(resp) {
                vm.hasDeleted = true;
                vm.response['success'] = "alert-success";
                vm.response['alert'] = "Success!";
                vm.response['msg'] = "Deleted category: " + category.name;
                getCategories();
                vm.hasAdded = true;
                vm.isDone = true;
                return true;
            }).catch(function(err) {
                vm.response['success'] = "alert-danger";
                vm.response['alert'] = "Error!";
                vm.response['msg'] = "Can not delete category: " + category.name;
                vm.response['error_arr'] = [];
                vm.response['error_arr'].push(err.data == null ? '' : err.data.errors);
                vm.hasAdded = true;
                vm.isDone = true;
                return false;
            });
        }
    }
})();
