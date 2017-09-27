(function() {
    'use strict';

    angular.module('app.categories')
        .controller('CategoryArchivedController', CategoryArchivedController);

    CategoryArchivedController.$inject = ['CategoryService', '$log', '$timeout'];

    /* @ngInject */
    function CategoryArchivedController(CategoryService, $log, $timeout) {
        var vm = this;

        vm.categories = [];
        vm.getCategories = getCategories;
        vm.hasDeleted = false;
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

            CategoryService.search(vm.searchItem, 'archived').then(function(resp) {
                vm.categories = resp;
                vm.isLoading = false;
            }).catch(function(err) {
                $log.log(err);
            });
        }

        function getCategories() {
            vm.isRetrieving = true;
            return CategoryService.search('', 'archived').then(function(data) {
                vm.categories = data;
                vm.isRetrieving = false;
                $timeout(function() {
                    vm.response.msg = false;
                }, 3000);
                return vm.categories;
            });
        }
    }
})();
