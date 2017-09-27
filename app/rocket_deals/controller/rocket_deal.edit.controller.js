(function() {
    'use strict';

    angular.module('app.rocketDeals')
        .controller('RocketDealEditController', RocketDealEditController);

    RocketDealEditController.$inject = [
            'RocketDealService',
            'prepSelRocketDeal',
            '$scope',
            'HelperService',
            '$state',
            '$stateParams',
            '$log',
            '$filter'];

    /* @ngInject */
    function RocketDealEditController(
            RocketDealService,
            prepSelRocketDeal,
            $scope,
            HelperService,
            $state,
            $stateParams,
            $log,
            $filter) {

        var vm = this;

        vm.mode = "Edit";
        vm.form = {};
        vm.rocketDealId = $stateParams.id;
        vm.selectedRocketDeal = prepSelRocketDeal;
        vm.form.name = vm.selectedRocketDeal.name;
        vm.form.status = vm.selectedRocketDeal.status;

        vm.response = {};
        vm.isDone = true;

        vm.prevState = HelperService.getPrevState();
        vm.submitAction = editRocketDeal;
        vm.isDealEmpty = false;

        ///////////////////

        activate();

        function activate() {
        }

        function editRocketDeal() {
            vm.isDone = false;

            RocketDealService.edit(vm.rocketDealId, vm.form).then(function() {
                vm.response['success'] = "alert-success";
                vm.response['alert'] = "Success!";
                vm.response['msg'] = "Updated Rocket Deal: " + vm.form.name;
                vm.isDone = true;

                $scope.$parent.vm.response = vm.response;
                $scope.$parent.vm.search();
                $state.go(vm.prevState);

            }).catch(function(err) {
                vm.response['success'] = "alert-danger";
                vm.response['alert'] = "Error!";
                vm.response['msg'] = "Failed to update new Rocket Deal.";
                vm.response['error_arr'] = err.data == null ? '' : err.data.errors;
                vm.isDone = true;

                HelperService.goToAnchor('msg-info');
            });
        }
    }
})();
