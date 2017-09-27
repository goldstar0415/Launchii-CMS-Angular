(function() {
    'use strict';

    angular.module('app.brands')
        .controller('BrandViewController', BrandViewController);

    BrandViewController.$inject = ['BrandService', '$stateParams', '$scope', 'prepSelBrand', 'HelperService', '$log'];

    /* @ngInject */
    function BrandViewController(BrandService, $stateParams, $scope, prepSelBrand, HelperService, $log) {
        var vm = this;

        vm.mode = "View";
        vm.response = {};
        vm.brandId = $stateParams.id;
        vm.brand = prepSelBrand;
        vm.isDone = false;

        //Images
        vm.openEditImageModal = openEditImageModal;

        vm.prevState = HelperService.getPrevState();

        //activate();

        ///////////////////

        function activate() {
        }

        function openEditImageModal(elem) {
            $(elem).parents('.image-view-container').find('.image-modal').modal('show');
        }
    }
})();
