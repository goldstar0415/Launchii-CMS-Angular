(function() {
    'use strict';

    angular.module('app.deals')
        .controller('DealPendingController', DealPendingController);

    DealPendingController.$inject = ['DealService', '$timeout', '$window', '$scope', '$log', 'prepDealType'];

    /* @ngInject */
    function DealPendingController(DealService, $timeout, $window, $scope, $log, prepDealType) {
        var vm = this;

        vm.response = {};
        vm.isLoading = false;

        vm.filterDealType = prepDealType;
        vm.filterDealStatus = 'pending';
        vm.searchTerm = '';

        vm.currPage = 1;
        vm.totalDeals = 0;
        vm.dealsPerPage = "10";
        vm.deals = [];

        vm.search = search;
        vm.startSearch = startSearch;
        vm.clearSearch = clearSearch;
        vm.approveDeal = approveDeal;
        vm.rejectDeal = rejectDeal;
        vm.openRejectModal = openRejectModal;
        vm.selectedDeal = '';

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

            DealService.search(vm.searchTerm, vm.filterDealType, vm.filterDealStatus, 'archived', vm.currPage, vm.dealsPerPage).then(function(resp) {
                vm.deals = resp.deals;
                vm.totalDeals = resp.total;
                vm.isLoading = false;
            }).catch(function(err) {
                $log.log(err);
                vm.isLoading = false;
            });
        }

        function approveDeal(element, deal){
            var ladda_elem = Ladda.create(element).start();
            doApprove(deal, ladda_elem);
        }

        function doApprove(deal, ladda_elem) {
            DealService.approve(deal.uid).then(function(resp) {
                vm.response['success'] = "alert-success";
                vm.response['alert'] = "Success!";
                vm.response['msg'] = "Approved deal: " + deal.name;
                search();
                $timeout(function() {
                    vm.response.msg = null;
                }, 3000);
                ladda_elem.remove();

            }).catch(function(err) {
                $log.log(err);
                vm.response['success'] = "alert-danger";
                vm.response['alert'] = "Error!";
                vm.response['msg'] = "Failed to approve deal: " + deal.name;
                ladda_elem.remove();
            });
        }


        function openRejectModal(element, deal){
            if(element){
                vm.selectedDeal = deal;
                $('#reject-deal-modal').modal('show');
            }
        }

        function rejectDeal(reason) {
            var body = {
                deal_id: vm.selectedDeal.uid,
                rejection_reason: reason
            };

            DealService.reject(vm.selectedDeal.uid, body).then(function(resp) {
                vm.response['success'] = "alert-success";
                vm.response['alert'] = "Success!";
                vm.response['msg'] = "Rejected deal: " + vm.selectedDeal.name;
                vm.selectedDeal = '';
                search();
                $timeout(function() {
                    vm.response.msg = null;
                }, 3000);
                $('#reject-deal-modal').modal('hide');
            }).catch(function(err) {
                $log.log(err);
                vm.response['success'] = "alert-danger";
                vm.response['alert'] = "Error!";
                vm.response['msg'] = "Failed to reject deal: " + vm.selectedDeal.name;
                vm.selectedDeal = '';
                $('#reject-deal-modal').modal('hide');
            });
        }
    }
})();
