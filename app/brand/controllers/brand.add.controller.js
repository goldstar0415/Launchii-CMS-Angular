(function() {
    'use strict';

    angular.module('app.brands')
        .controller('BrandAddController', BrandAddController);

    BrandAddController.$inject = ['BrandService', 'UserService', '$scope', 'HelperService', '$state', '$log'];

    /* @ngInject */
    function BrandAddController(BrandService, UserService, $scope, HelperService, $state, $log) {
        var vm = this;

        vm.mode = "Add";
        vm.form = {};
        vm.form.facebook = "https://facebook.com/";
        vm.form.twitter = "https://twitter.com/";
        vm.form.instagram = "https://instagram.com/";
        vm.response = {};
        vm.isDone = true;

        //Logo
        vm.clearLogoImage = clearImage;
        vm.clearCoverImage = clearImage;
        vm.previewImage = previewImage;

        // Vendors
        vm.vendors = [];

        vm.prevState = HelperService.getPrevState();
        vm.submitAction = addBrand;

        ///////////////////

        activate();

        function activate() {
            getVendors();
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

        function clearImage(imgModel, container) {
            imgModel.file = null;
            imgModel.file = "";
            angular.element(container).html('<h4 class="text-center no-image no-image-border">no image</h4>');
        }

        function addBrand() {
            vm.isDone = false;

            BrandService.add(vm.form).then(function() {
                vm.response['success'] = "alert-success";
                vm.response['alert'] = "Success!";
                vm.response['msg'] = "Added brand: " + vm.form.name;
                vm.isDone = true;

                $scope.$parent.vm.response = vm.response;
                $scope.$parent.vm.search();
                $state.go(vm.prevState);

            }).catch(function(err) {
                vm.response['success'] = "alert-danger";
                vm.response['alert'] = "Error!";
                vm.response['msg'] = "Failed to add new Brand.";
                vm.response['error_arr'] = err.data == null ? '' : err.data.errors;
                vm.isDone = true;

                HelperService.goToAnchor('msg-info');
            });
        }
    }
})();
