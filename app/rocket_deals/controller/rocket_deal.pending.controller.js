(function() {
    'use strict';

    angular.module('app.rocketDeals')
        .controller('RocketDealPendingController', RocketDealPendingController);

    RocketDealPendingController.$inject = ['RocketDealService', 'DealService', '$state', '$timeout', '$window', '$scope', '$log'];

    /* @ngInject */
    function RocketDealPendingController(RocketDealService, DealService, $state, $timeout, $window, $scope, $log) {
        var vm = this;

        vm.response = {};
        vm.isLoading = false;

        vm.filterRocketDealStatus = 'pending';
        vm.searchTerm = '';

        vm.currPage = 1;
        vm.totalRocketDeals = 0;
        vm.rocketDealsPerPage = "10";
        vm.rocketDeals = [];

        vm.search = search;
        vm.startSearch = startSearch;
        vm.clearSearch = clearSearch;
        vm.approveRocketDeal = approveRocketDeal;
        vm.rejectRocketDeal = rejectRocketDeal;
        vm.openRejectModal = openRejectModal;
        vm.selectedRocketDeal = '';

        vm.navigateToDeal = navigateToDeal;

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
            vm.rocketDeals = [];
            vm.isLoading = true;
            vm.searchTerm = vm.searchTerm.trim();

            RocketDealService.search(vm.searchTerm, vm.filterRocketDealStatus, 'finished', vm.currPage, vm.rocketDealsPerPage).then(function(resp) {
                vm.rocketDeals = resp.rocket_deals;
                vm.totalRocketDeals = resp.total;
                vm.isLoading = false;
            }).catch(function(err) {
                $log.log(err);
                vm.isLoading = false;
            });
        }

        function approveRocketDeal(element, rocketDeal){
            var ladda_elem = Ladda.create(element).start();
            doApprove(rocketDeal, ladda_elem);
        }

        function doApprove(rocketDeal, ladda_elem) {
            RocketDealService.approve(rocketDeal.uid).then(function(resp) {
                vm.response['success'] = "alert-success";
                vm.response['alert'] = "Success!";
                vm.response['msg'] = "Approved rocket deal: " + rocketDeal.name;
                search();
                $timeout(function() {
                    vm.response.msg = null;
                }, 3000);
                ladda_elem.remove();

            }).catch(function(err) {
                $log.log(err);
                vm.response['success'] = "alert-danger";
                vm.response['alert'] = "Error!";
                vm.response['msg'] = "Failed to approve rocket deal: " + rocketDeal.name;
                ladda_elem.remove();
            });
        }


        function openRejectModal(element, rocketDeal){
            if(element){
                vm.selectedRocketDeal = rocketDeal;
                $('#reject-rocket-deal-modal').modal('show');
            }
        }

        function rejectRocketDeal(reason) {
            var body = {
                rejection_reason: reason
            };

            RocketDealService.reject(vm.selectedRocketDeal.uid, body).then(function(resp) {
                vm.response['success'] = "alert-success";
                vm.response['alert'] = "Success!";
                vm.response['msg'] = "Rejected rocket deal: " + vm.selectedRocketDeal.name;
                vm.selectedRocketDeal = '';
                search();
                $timeout(function() {
                    vm.response.msg = null;
                }, 3000);
                $('#reject-rocket-deal-modal').modal('hide');
            }).catch(function(err) {
                $log.log(err);
                vm.response['success'] = "alert-danger";
                vm.response['alert'] = "Error!";
                vm.response['msg'] = "Failed to reject rocket deal: " + vm.selectedRocketDeal.name;
                vm.selectedRocketDeal = '';
                $('#reject-rocket-deal-modal').modal('hide');
            });
        }

        function navigateToDeal(rocketDeal) {
            DealService.getById(rocketDeal.deal_id).then(function(deal) {
                if (deal.deal_type == 'upsell') {
                    $state.go('dashboard.upsell.view', {id: rocketDeal.deal_id});
                } else {
                    $state.go('dashboard.deal.view', {id: rocketDeal.deal_id});
                }
            }).catch(function(err) {
                $log.log(err);
            });
        }
    }
})();
