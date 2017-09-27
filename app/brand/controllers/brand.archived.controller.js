(function() {
    'use strict';

    angular.module('app.brands')
        .controller('BrandArchivedController', BrandArchivedController);

    BrandArchivedController.$inject = ['BrandService', '$log', '$timeout'];

    /* @ngInject */
    function BrandArchivedController(BrandService, $log, $timeout) {
        var vm = this;

        vm.response = {};
        vm.isLoading = false;

        vm.searchTerm = '';
        vm.filterBrandStatus = 'archived';

        vm.currPage = 1;
        vm.totalBrands = 0;
        vm.brandsPerPage = '500';
        vm.brands = [];

        vm.search = search;
        vm.startSearch = startSearch;
        vm.clearSearch = clearSearch;

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

        function search() {
            vm.brands = [];
            vm.isLoading = true;
            vm.searchTerm = vm.searchTerm.trim();

            BrandService.search(vm.searchTerm, '', vm.filterBrandStatus, '', vm.currPage, vm.brandsPerPage).then(function(resp) {
                vm.brands = resp.brands;
                vm.totalBrands = resp.total;
                vm.isLoading = false;
            }).catch(function(err) {
                $log.log(err);
                vm.isLoading = false;
            });
        }
    }
})();
