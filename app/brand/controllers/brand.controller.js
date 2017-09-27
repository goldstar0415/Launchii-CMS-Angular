(function() {
    'use strict';

    angular.module('app.brands')
        .controller('BrandController', BrandController);

    BrandController.$inject = ['BrandService', '$log', '$timeout'];

    /* @ngInject */
    function BrandController(BrandService, $log, $timeout) {
        var vm = this;

        vm.response = {};
        vm.isLoading = false;

        vm.searchTerm = '';
        vm.filterBrandStatus = '';

        vm.currPage = 1;
        vm.totalBrands = 0;
        vm.brandsPerPage = '500';
        vm.brands = [];

        vm.search = search;
        vm.startSearch = startSearch;
        vm.clearSearch = clearSearch;
        vm.deleteBrand = deleteBrand;

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

            BrandService.search(vm.searchTerm, '', vm.filterBrandStatus, 'archived', vm.currPage, vm.brandsPerPage).then(function(resp) {
                vm.brands = resp.brands;
                vm.totalBrands = resp.total;
                vm.isLoading = false;
            }).catch(function(err) {
                $log.log(err);
                vm.isLoading = false;
            });
        }

        function deleteBrand(element, brand) {
            bootbox.confirm({
                title: "Confirm Delete",
                message: "Are you sure you want to delete brand: <b>" + brand.name + "</b>?",
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
                        doDelete(brand, ladda);
                    }
                }
            });

        }

        function doDelete(brand, ladda) {
            BrandService.delete(brand.uid).then(function(resp) {
                vm.response['success'] = "alert-success";
                vm.response['alert'] = "Success!";
                vm.response['msg'] = "Deleted brand: " + brand.name;
                search();
                $timeout(function() {
                    vm.response.msg = null;
                }, 3000);
                ladda.remove();
            }).catch(function(err) {
                vm.response['success'] = "alert-danger";
                vm.response['alert'] = "Error!";
                vm.response['msg'] = "Can not delete brand: " + brand.name;
                vm.response['error_arr'] = [];
                vm.response['error_arr'].push(err.data == null ? '' : err.data.errors);
                ladda.remove();
            });
        }
    }
})();
