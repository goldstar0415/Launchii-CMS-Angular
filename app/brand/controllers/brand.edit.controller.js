(function() {
    'use strict';

    angular.module('app.brands')
        .controller('BrandEditController', BrandEditController);

    BrandEditController.$inject = ['BrandService', 'UserService', '$stateParams', '$scope', 'prepSelBrand', 'HelperService', '$state', '$log'];

    /* @ngInject */
    function BrandEditController(BrandService, UserService, $stateParams, $scope, prepSelBrand, HelperService, $state, $log) {
        var vm = this;

        vm.mode = "Edit";
        vm.response = {};
        vm.brandId = $stateParams.id;
        vm.selectedBrand = prepSelBrand;
        vm.form = vm.selectedBrand;
        vm.isDone = true;

        //Logo
        vm.clearLogoImage = clearLogoImage;
        vm.clearCoverImage = clearCoverImage;
        vm.previewImage = previewImage;

        // Vendors
        vm.vendors = [];

        vm.prevState = HelperService.getPrevState();
        vm.submitAction = editPost;

        activate();

        ///////////////////

        function activate() {
            $log.log(vm.form);
            getVendors();
            //console.log('hey');
            // BrandService.find(vm.brandId).then(function(data) {
            //     vm.selectedBrand = data;
            //     vm.form = vm.selectedBrand;
            // });

            // vm.$watch('form.logo', function() {
            //     $log.log(vm.form.logo);
            // });
        }

        function getVendors(){
            UserService.search('', 'vendor', 1, 500).then(function(resp) {
                vm.vendors = resp.users;
            });
        }

        function previewImage(logo, elem, img) {
            var filebase64 = 'data:' + logo.filetype + ';base64,' + logo.base64;
            angular.element(elem).html('<label>' + img + ' Preview:</label><div><img src="' + filebase64 + '" style="width: 250px; height: auto;border: 1px solid #f0f0f0;" /></div>');
        }

        function clearLogoImage(imgModel, container) {
            imgModel.file = null;
            imgModel.file = "";
            angular.element(container).html('<label>Logo Preview:</label><div><img src="' + vm.form.logo_image.standard_url + '" style="width: 250px; height: auto;border: 1px solid #f0f0f0;" /></div>');
        }

        function clearCoverImage(imgModel, container) {
            imgModel.file = null;
            imgModel.file = "";
            angular.element(container).html('<label>Cover Image Preview:</label><div><img src="' + vm.form.cover_image.standard_url + '" style="width: 250px; height: auto;border: 1px solid #f0f0f0;" /></div>');
        }

        function editPost() {
            vm.isDone = false;

            BrandService.edit(vm.brandId, vm.form).then(function() {
                vm.response['success'] = "alert-success";
                vm.response['alert'] = "Success!";
                vm.response['msg'] = "Updated brand: " + vm.form.name;
                vm.isDone = true;

                $scope.$parent.vm.response = vm.response;
                $scope.$parent.vm.search();
                $state.go(vm.prevState);

            }).catch(function(err) {
                $log.log(err);
                vm.response['success'] = "alert-danger";
                vm.response['alert'] = "Error!";
                vm.response['msg'] = "Failed to update Brand.";
                vm.response['error_arr'] = err.data == null ? '' : err.data.errors;
                vm.isDone = true;

                HelperService.goToAnchor('msg-info');
            });
        }
    }
})();
