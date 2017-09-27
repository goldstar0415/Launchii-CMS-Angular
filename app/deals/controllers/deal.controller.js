(function() {
    'use strict';

    angular.module('app.deals')
        .controller('DealController', DealController);

    DealController.$inject = ['DealService', '$timeout', '$window', '$scope', '$log', 'prepDealType'];

    /* @ngInject */
    function DealController(DealService, $timeout, $window, $scope, $log, prepDealType) {
        var vm = this;

        vm.response = {};
        vm.isLoading = false;

        vm.searchTerm = '';
        vm.filterDealType = prepDealType
        vm.filterDealStatus = '';

        vm.currPage = 1;
        vm.totalDeals = 0;
        vm.dealsPerPage = "10";
        vm.deals = [];

        vm.search = search;
        vm.startSearch = startSearch;
        vm.clearSearch = clearSearch;
        vm.deleteDeal = deleteDeal;

        if ($window.__env.apiUrl.toLowerCase().indexOf('stageapi') > -1) {
          vm.customerHost = 'http://staging.launchii.com';
        } else {
          vm.customerHost = 'http://www.launchii.com';
        }

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

        $scope.$watch('vm.filterDealStatus', function(newValue, oldValue) {
            if (newValue == oldValue) {
                return;
            }
            startSearch();
        });

        function search() {
            vm.deals = [];
            vm.isLoading = true;
            vm.searchTerm = vm.searchTerm.trim();

            DealService.search(vm.searchTerm, vm.filterDealType, vm.filterDealStatus, 'archived', vm.currPage, vm.dealsPerPage).then(function(resp) {
                vm.deals = resp.deals;
                vm.totalDeals = resp.total;
                vm.isLoading = false;
            }).catch(function(err) {
                $log.log(err);
                vm.isLoading = false;
            });
        }

        function deleteDeal(element, deal) {
            bootbox.confirm({
                title: "Confirm Delete",
                message: "Are you sure you want to delete deal: <b>" + deal.name + "</b>?",
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
                        doDelete(deal, ladda);
                    }
                }
            });
        }

        function doDelete(deal, ladda) {
            DealService.delete(deal.uid).then(function(resp) {
                vm.response['success'] = "alert-success";
                vm.response['alert'] = "Success!";
                vm.response['msg'] = "Deleted deal: " + deal.name;
                search();
                $timeout(function() {
                    vm.response.msg = null;
                }, 3000);
                ladda.remove();

            }).catch(function(err) {
                $log.log(err);
                vm.response['success'] = "alert-danger";
                vm.response['alert'] = "Error!";
                vm.response['msg'] = "Failed to delete deal: " + deal.name;
                ladda.remove();
            });
        }
    }
})();
