(function() {
    'use strict';

    angular.module('app.deals')
        .controller('DealViewController', DealViewController);

    DealViewController.$inject = [
        'DealService',
        '$state',
        '$stateParams',
        '$scope',
        'prepSelDeal',
        'HelperService',
        'prepActiveStandardD',
        'prepDealImages',
        'prepDealVideos',
        'prepSelVariants',
        '$window',
        '$timeout'
    ];

    /* @ngInject */
    function DealViewController(
        DealService,
        $state,
        $stateParams,
        $scope,
        prepSelDeal,
        HelperService,
        prepActiveStandardD,
        prepDealImages,
        prepDealVideos,
        prepSelVariants,
        $window,
        $timeout
    ) {

        var vm = this;

        vm.mode = "View";
        vm.response = {};
        vm.dealId = $stateParams.id;
        vm.deal = prepSelDeal;
        vm.isDone = false;
        vm.editType = 'standard';

        //Discounts
        vm.activeDiscounts = prepActiveStandardD;
        vm.activeDiscount = (angular.isDefined(vm.activeDiscounts) && vm.activeDiscounts.length > 0) ? vm.activeDiscounts[0] : null;

        vm.hasImages = hasImages;
        vm.hasVideos = hasVideos;

        //Images
        vm.images = prepDealImages;
        vm.openEditImageModal = openEditImageModal;
        vm.prevState = HelperService.getPrevState();

        if ($window.__env.apiUrl.toLowerCase().indexOf('stageapi') > -1) {
          vm.customerHost = 'http://staging.launchii.com';
        } else {
          vm.customerHost = 'http://www.launchii.com';
        }

        //Videos
        vm.videos = prepDealVideos;
        vm.openEditVideoModal = openEditVideoModal;

        // Variants
        vm.variants = prepSelVariants;        

        vm.deleteDeal = deleteDeal;

        activate();

        ///////////////////

        function activate() {
            vm.editType = ($state.current.name == "dashboard.upsell.view") ? 'upsell' : 'standard';
            getUpsellAssociationInfo();
        }        

        $scope.$on('$viewContentLoaded', function() {
            var menuId = "#deal-list-menu";
            if (vm.deal.deal_type == 'upsell') {
                menuId = "#upsell-list-menu";
            }

            var element = $(menuId);
            if (!element.parent().hasClass("open")) {
                element.click();
            }
        });

        function getUpsellAssociationInfo(){
            vm.deal.upsell_assciation_infos = [];
            angular.forEach(vm.deal.upsell_associations, function(assoc, index) {
                DealService.find(assoc).then(function(upsell) {
                    vm.deal.upsell_assciation_infos.push(upsell);
                });
            });            
        }

        function openEditImageModal(elem) {
            $(elem).parents('.image-view-container').find('.image-modal').modal('show');
        }
        function openEditVideoModal(elem) {
            $(elem).parents('.video-view-container').find('.video-modal').modal('show');
        }
        function hasImages() {
          return angular.isDefined(vm.images) && vm.images.length > 0;
        }
        function hasVideos() {
          return angular.isDefined(vm.videos) && vm.videos.length > 0;
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
                vm.deal.is_archived = true;
                vm.response['success'] = "alert-success";
                vm.response['alert'] = "Success!";
                vm.response['msg'] = "Deleted deal: " + deal.name;
                $timeout(function() {
                    vm.response.msg = null;
                }, 5000);
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
