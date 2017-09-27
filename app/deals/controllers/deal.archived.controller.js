(function() {
    'use strict';

    angular.module('app.deals')
        .controller('DealArchivedController', DealArchivedController);

    DealArchivedController.$inject = ['DealService', '$timeout', '$window', '$scope', '$log', 'prepDealType'];

    /* @ngInject */
    function DealArchivedController(DealService, $timeout, $window, $scope, $log, prepDealType) {
        var vm = this;

        vm.response = {};
        vm.isLoading = false;

        vm.filterDealType = prepDealType;
        vm.filterDealStatus = 'archived';
        vm.searchTerm = '';

        vm.currPage = 1;
        vm.totalDeals = 0;
        vm.dealsPerPage = "10";
        vm.deals = [];

        vm.search = search;
        vm.startSearch = startSearch;
        vm.clearSearch = clearSearch;

        if ($window.__env.apiUrl.toLowerCase().indexOf('stageapi') > -1) {
          vm.customerHost = 'http://staging.launchii.com';
        } else {
          vm.customerHost = 'http://www.launchii.com';
        }

        activate();

        ////////////////

        function activate() {
            search();
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
            vm.deals = [];
            vm.isLoading = true;
            vm.searchTerm = vm.searchTerm.trim();

            DealService.search(vm.searchTerm, vm.filterDealType, vm.filterDealStatus, '', vm.currPage, vm.dealsPerPage).then(function(resp) {
                vm.deals = resp.deals;
                vm.totalDeals = resp.total;
                vm.isLoading = false;
            }).catch(function(err) {
                $log.log(err);
                vm.isLoading = false;
            });
        }
    }
})();
