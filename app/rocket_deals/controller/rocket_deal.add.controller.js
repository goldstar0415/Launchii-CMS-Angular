(function() {
    'use strict';

    angular.module('app.rocketDeals')
        .controller('RocketDealAddController', RocketDealAddController);

    RocketDealAddController.$inject = ['RocketDealService', 'UserService', 'DealService', '$scope', 'HelperService', '$state', '$log', '$filter', '$timeout'];

    /* @ngInject */
    function RocketDealAddController(RocketDealService, UserService, DealService, $scope, HelperService, $state, $log, $filter, $timeout) {
        var vm = this;

        vm.mode = "Add";
        vm.form = {};
        vm.form.vendor_id = '';

        vm.time_ends = '';
        vm.time_starts = '';
        vm.date_ends = '';
        vm.date_starts = '';
        vm.time_expire = '';
        vm.date_expire = '';

        vm.response = {};
        vm.isDone = true;
        vm.deals = [];
        vm.default = {};

        // Vendors
        vm.vendors = [];

        vm.prevState = HelperService.getPrevState();
        vm.submitAction = addRocketDeal;
        vm.updateDateDiff = updateDateDiff;
        vm.updateExpireDateDiff = updateExpireDateDiff;
        vm.isDealEmpty = false;

        ///////////////////

        activate();

        function activate() {
            // for brand list per vendor
            $scope.$watch('vm.form.vendor_id', function(newValue, oldValue) {
                DealService.vendorDeals(vm.form.vendor_id).then(function(resp) {
                    vm.deals = resp.deals;
                    vm.default = vm.deals[0];
                    vm.isDealEmpty = !(vm.deals.length > 0);
                });
            });
            getVendors();

            vm.time_expire = vm.time_ends = vm.time_starts = $filter('date')(new Date(), "hh:mm:ss a");

            $timeout(function() {
                initDateTimePickers();
            }, 0, false);

        }

        function getVendors(){
            UserService.search('', 'vendor', 1, 500).then(function(resp) {
                vm.vendors = resp.users;
            });
        }

        function initDateTimePickers(){
            var datePickerOptions = {
                autoclose: true,
                format: 'yyyy-mm-dd'
            };
            var timePickerOptions = {
                autoclose: true,
                showSeconds: true,
                minuteStep: 1
            }
            $('#deal-start-date').datepicker(datePickerOptions);
            $('#deal-end-date').datepicker(datePickerOptions);
            $('#discount-expire-date').datepicker(datePickerOptions);
            $('#deal-start-date').datepicker('setStartDate', new Date());
            $('#deal-end-date').datepicker('setStartDate', new Date());
            $('#discount-expire-date').datepicker('setStartDate', new Date());
            $('#deal-start-time').timepicker(timePickerOptions);
            $('#deal-end-time').timepicker(timePickerOptions);
            $('#discount-expire-time').timepicker(timePickerOptions);
        }

        function addRocketDeal() {
            vm.isDone = false;

            vm.form.start_at = HelperService.combineDateTime(vm.date_starts, vm.time_starts);
            vm.form.end_at = HelperService.combineDateTime(vm.date_ends, vm.time_ends);
            vm.form.discount_attributes.codes_expire_at = HelperService.combineDateTime(vm.date_expire, vm.time_expire);

            RocketDealService.add(vm.form).then(function() {
                vm.response['success'] = "alert-success";
                vm.response['alert'] = "Success!";
                vm.response['msg'] = "Added Rocket Deal: " + vm.form.name;
                vm.isDone = true;

                $scope.$parent.vm.response = vm.response;
                $scope.$parent.vm.startSearch();
                $state.go(vm.prevState);

            }).catch(function(err) {
                $log.log(err);
                vm.response['success'] = "alert-danger";
                vm.response['alert'] = "Error!";
                vm.response['msg'] = "Failed to add new Rocket Deal.";
                vm.response['error_arr'] = err.data == null ? '' : err.data.errors;
                vm.isDone = true;

                HelperService.goToAnchor('msg-info');
            });
        }

        function updateDateDiff() {
            if (!angular.isDefined(vm.date_starts) || vm.date_starts == null) {
                return;
            }

            vm.date_ends = '';

            var dateNow = new Date();
            var dateComp = new Date(vm.date_starts);

            var timeDiff = Math.abs(dateComp.getTime() - dateNow.getTime());
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

            $('#deal-end-date').datepicker({
                autoclose: true
            });

            $('#deal-end-date').datepicker('setStartDate', '+' + diffDays + 'd');

        }

        function updateExpireDateDiff() {
            if (!angular.isDefined(vm.date_starts) || vm.date_starts == null || !angular.isDefined(vm.date_ends) || vm.date_ends == null) {
                return;
            }

            vm.date_expire = '';

            var dateNow = new Date();
            var dateStartComp = new Date(vm.date_starts);
            var dateEndComp = new Date(vm.date_ends);

            var timeStartDiff = Math.abs(dateStartComp.getTime() - dateNow.getTime());
            var diffStartDays = Math.ceil(timeStartDiff / (1000 * 3600 * 24));

            var timeEndDiff = Math.abs(dateEndComp.getTime() - dateNow.getTime());
            var diffEndDays = Math.ceil(timeEndDiff / (1000 * 3600 * 24));

            $('#discount-expire-date').datepicker({
                autoclose: true
            });

            $('#discount-expire-date').datepicker('setStartDate', '+' + diffStartDays + 'd');
            $('#discount-expire-date').datepicker('setEndDate', '+' + diffEndDays + 'd');

        }
    }
})();
