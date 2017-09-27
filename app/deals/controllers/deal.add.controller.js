(function() {
    'use strict';

    angular.module('app.deals')
        .controller('DealAddController', DealAddController);

    DealAddController.$inject = [
                        'DealService',
                        'UserService',
                        'BrandService',
                        '$scope',
                        'HelperService',
                        '$state',
                        'prepDealType',
                        'brandPrepService',
                        'categoryPrepService',
                        '$log',
                        '$timeout'];

    /* @ngInject */
    function DealAddController(
                    DealService,
                    UserService,
                    BrandService,
                    $scope,
                    HelperService,
                    $state,
                    prepDealType,
                    brandPrepService,
                    categoryPrepService,
                    $log,
                    $timeout) {
        var vm = this;

        vm.mode = "Add";
        vm.form = {};
        vm.form.status = 'draft';
        vm.form.deal_type = prepDealType;
        vm.form.vendor_id = '';
        vm.form.variants = [];
        vm.response = {};
        vm.isDone = true;
        vm.brands = brandPrepService.brands;
        vm.default = vm.brands[0];
        vm.categories = categoryPrepService.categories;
        vm.defaultCategory = vm.categories[0];

        vm.priceFormat = priceFormat;

        //discount
        vm.form.discount = null;
        vm.workingDiscountIndex = -1;       // -1 for add, 0 for edit existing one, 1 for edit new one
        vm.workingDiscount = null;
        vm.commitDiscountDisabled = true;

        vm.openDiscountModal = openDiscountModal;
        vm.removeNewDiscount = removeNewDiscount;
        vm.onDiscountCommitted = onDiscountCommitted;

        vm.upsellDeals = [];
        vm.form.upsell_associations = [];

        //image
        vm.form.file = [];
        vm.imageCounter = 0;
        vm.getImageCounter = getImageCounter;
        vm.removeAddedImage = removeAddedImage;
        vm.insertNewImageObj = insertNewImageObj;
        vm.latestImgIndex = latestImgIndex;
        vm.blankFn = blankFn;
        //Video
        vm.form.videos = [];
        vm.videoCounter = 0;
        vm.removeAddedVideo = removeAddedVideo;
        vm.insertNewVideoObj = insertNewVideoObj;
        vm.latestVideoIndex = latestVideoIndex;

        vm.updateDateDiff = updateDateDiff;
        vm.prevState = HelperService.getPrevState();
        vm.submitAction = addDeal;
        vm.isBrandEmpty = brandPrepService.total == 0;
        vm.isCategoryEmpty = categoryPrepService.total == 0;

        // vendors
        vm.vendors = [];

        // variants
        vm.finalVariants = vm.form.variants;
        vm.removeVariant = removeVariant;
        vm.hasVariants = hasVariants;

        vm.workingVariantIndex = -1;
        vm.workingVariant = {};
        vm.onAddVariant = onAddVariant;
        vm.onEditVariant = onEditVariant;
        vm.onVariantCommitted = onVariantCommitted;
        vm.commitVariantDisabled = true;

        vm.capFirstLetter = HelperService.capFirstLetter;

        vm.saveMode = '';
        vm.setSaveMode = setSaveMode;

        activate();

        ///////////////////

        function activate() {

            $timeout(function() {
                initDateTimePickers();
            }, 0, false);

            // for Add/Edit variant button disabled status
            $scope.$watch('vm.workingVariant.name', function(newValue, oldValue) {
                updateVariantFormButton();
            });

            $scope.$watch('vm.workingVariant.color', function(newValue, oldValue) {
                updateVariantFormButton();
            });

            // for Add/Edit discount button disabled status
            $scope.$watch('vm.workingDiscount.value', function(newValue, oldValue) {
                updateDiscountFormButton();
            });

            $scope.$watch('vm.workingDiscount.coupon_limit', function(newValue, oldValue) {
                updateDiscountFormButton();
            });

            $scope.$watch('vm.workingDiscount.codes_txt', function(newValue, oldValue) {
                updateDiscountFormButton();
            });

            $scope.$watch('vm.workingDiscount.codes_expire_at', function(newValue, oldValue) {
                updateDiscountFormButton();
            });

            // for brand list per vendor
            $scope.$watch('vm.form.vendor_id', function(newValue, oldValue) {
                BrandService.vendorBrands(vm.form.vendor_id).then(function(resp) {
                    vm.brands = resp.brands;
                    vm.default = vm.brands[0];
                });
                if (vm.form.deal_type == 'standard') {
                    if (angular.isDefined(vm.form.vendor_id) && vm.form.vendor_id != '') {
                        DealService.getUpsellDeals(vm.form.vendor_id).then(function(resp) {
                            vm.upsellDeals = resp;
                        }).catch(function(err) {
                            $log.log(err);
                            vm.upsellDeals = [];
                        });
                    } else {
                        vm.upsellDeals = [];
                    }
                }
            });

            insertNewImageObj();
            insertNewVideoObj();
            getVendors();
        }

        function initDateTimePickers() {
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
        }

        function getVendors(){
            UserService.search('', 'vendor', 1, 500).then(function(resp) {
                vm.vendors = resp.users;
            });
        }

        function blankFn() {
            return false;
        }

        function latestImgIndex() {
            return vm.form.file.length - 1;
        }

        function insertNewImageObj() {
            var obj = {
                file: "",
                description: ""
            };
            vm.form.file.push(obj);
        }

        function removeAddedImage(image) {
            angular.forEach(vm.form.file, function(img, index) {
                if (img === image) {
                    vm.form.file.splice(index, 1);
                }
            });
        }

        function countValidImages() {
            var count = 0;
            angular.forEach(vm.form.file, function(img, index) {
                if (img.file !== undefined && img.file != null &&
                    img.file !== "" && angular.isObject(img.file)) {
                    count ++;
                }
            });
            return count;
        }

        function getImageCounter() {
            return vm.imageCounter++;
        }

        // Video
        function latestVideoIndex() {
            return vm.form.videos.length - 1;
        }

        function insertNewVideoObj() {
            var obj = {
                title: "",
                description: "",
                embedded_content: "",
                source_type: "embed",
                attachment: "",
                image_attributes: {
                    description: '',
                    file: ''
                }
            };
            vm.form.videos.push(obj);
        }

        function removeAddedVideo(selvideo) {
            angular.forEach(vm.form.videos, function(video, index) {
                if (selvideo === video) {
                    vm.form.videos.splice(index, 1);
                }
            });
        }

        function updateDateDiff() {
            if (!angular.isDefined(vm.form.date_starts) || vm.form.date_starts == null) {
                return;
            }

            vm.form.date_ends = '';

            var dateNow = new Date();
            var dateComp = new Date(vm.form.date_starts);

            var timeDiff = Math.abs(dateComp.getTime() - dateNow.getTime());
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

            $('#deal-end-date').datepicker('setStartDate', '+' + diffDays + 'd');
        }

        function priceFormat() {
            var price = vm.form.price;

            vm.form.price = parseFloat(price).toFixed(2) + '';
        }
        //Template

        //END Template

        function addDeal() {
            if(vm.form.description.length > 50) return;
            
            vm.isDone = false;

            // image validation for published status
            if (vm.form.status === 'published' &&
                countValidImages() <= 0) {
              bootbox.alert({
                  title: "No uploaded images!",
                  message: "Please upload images to publish the deal."
              });
              vm.isDone = true;
              return false;
            }

            // discount validation for published status
            if (vm.form.status === 'published' &&
                vm.form.discount == null) {
              bootbox.alert({
                  title: "No active discount!",
                  message: "Please create an active discount to publish the deal."
              });
              vm.isDone = true;
              return false;
            }

            vm.form.starts_at = HelperService.combineDateTime(vm.form.date_starts, vm.form.time_starts);
            vm.form.ends_at = HelperService.combineDateTime(vm.form.date_ends, vm.form.time_ends);

            DealService.add(vm.form).then(function(resp) {
                vm.response['success'] = "alert-success";
                vm.response['alert'] = "Success!";
                vm.response['msg'] = "Added new deal.";
                var dealId = resp;
                vm.isDone = true;


                if(vm.saveMode == 'design'){
                    if (vm.form.deal_type == 'upsell'){
                        $state.go('dashboard.upsell.design', {id: dealId});
                    } else {                        
                        $state.go('dashboard.deal.design', {id: dealId});
                    }
                } else if (vm.saveMode == 'finish'){
                    $scope.$parent.vm.search();
                    $state.go(vm.prevState);
                }
            }).catch(function(err) {
                vm.response['success'] = "alert-danger";
                vm.response['alert'] = "Error!";
                vm.response['msg'] = "Failed to add deal.";
                vm.response['error_arr'] = err.data == null ? '' : err.data.errors;
                vm.isDone = true;

                HelperService.goToAnchor('msg-info');
            });
        }

        ////////////////////////////////////////////////////////////////////
        //                          For Variants                          //
        ////////////////////////////////////////////////////////////////////
        function removeVariant(variant_index) {
          vm.finalVariants.splice(variant_index, 1);
        }

        function hasVariants() {
            return vm.finalVariants.length > 0;
        }

        function onAddVariant() {
            vm.workingVariantIndex = -1;
            delete vm.workingVariant.name;
            vm.workingVariant.color = '#808080';
            $('#variant-modal').modal('show');
        }

        function onEditVariant(variant_index) {
            if (variant_index < 0 || variant_index >= vm.finalVariants.length) {
                return;
            }
            vm.workingVariantIndex = variant_index;
            vm.workingVariant.name = vm.finalVariants[variant_index].name;
            vm.workingVariant.color = vm.finalVariants[variant_index].color;
            $('#variant-modal').modal('show');
        }

        function onVariantCommitted() {
            if (!angular.isDefined(vm.workingVariant.name) ||
                vm.workingVariant.name.trim() == '' ||
                HelperService.checkValidHexColor(vm.workingVariant.color) == false) {
                return;
            }

            // Check for duplication
            var isDuplicated = false;
            angular.forEach(vm.finalVariants, function(variant, index) {
                if (index != vm.workingVariantIndex) {
                    if (variant.name == vm.workingVariant.name ||
                        variant.color == vm.workingVariant.color) {
                            isDuplicated = true;
                        }
                }
            });

            if (isDuplicated) {
                bootbox.alert({
                    title: "Variant duplicated!",
                    message: "There is a variant with same name or color already."
                });
                return;
            }

            var variantInArray = null;
            if (vm.workingVariantIndex == -1) {
                variantInArray = {};
                vm.finalVariants.push(variantInArray);
            } else {
                variantInArray = vm.finalVariants[vm.workingVariantIndex];
            }

            variantInArray.name = vm.workingVariant.name;
            variantInArray.color = vm.workingVariant.color;
        }

        function updateVariantFormButton() {
            var nameValid = false;
            if (angular.isDefined(vm.workingVariant.name)) {
                if (vm.workingVariant.name.trim() == '') {
                    nameValid = false;
                } else {
                    nameValid = true;
                }
            } else {
                nameValid = false;
            }

            var colorValid = HelperService.checkValidHexColor(vm.workingVariant.color);

            if (nameValid && colorValid) {
                vm.commitVariantDisabled = false;
            } else {
                vm.commitVariantDisabled = true;
            }
        }

        ////////////////////////////////////////////////////////////////////
        //                          For Discount                          //
        ////////////////////////////////////////////////////////////////////
        function openDiscountModal(index) {
            if (index == -1) {          // Add discount
                if (angular.isDefined(vm.form.discount) && vm.form.discount != null) {
                    return;
                }
                vm.workingDiscount = {};
                vm.workingDiscount.value_type = 'percentage';
            } else if (index == 1) {    // Edit new discount
                if (!angular.isDefined(vm.form.discount) || vm.form.discount == null) {
                    return;
                }
                vm.workingDiscount = {};
                vm.workingDiscount.value = vm.form.discount.value;
                vm.workingDiscount.value_type = vm.form.discount.value_type;
                vm.workingDiscount.coupon_limit = vm.form.discount.coupon_limit;
            } else {
                return;
            }

            vm.workingDiscountIndex = index;
            $('#discount-modal').modal('show');
        }

        function removeNewDiscount() {
            if (!angular.isDefined(vm.form.discount) || vm.form.discount == null) {
                return;
            }
            vm.form.discount = null;
        }

        function onDiscountCommitted() {
            if (vm.workingDiscountIndex == -1) {
                if (angular.isDefined(vm.form.discount) && vm.form.discount != null) {
                    return;
                }

                vm.form.discount = {};
                vm.form.discount.value = vm.workingDiscount.value;
                vm.form.discount.value_type = vm.workingDiscount.value_type;
                vm.form.discount.discount_type = 'standard';
                vm.form.discount.weighting = 0;
                vm.form.discount.coupon_limit = vm.workingDiscount.coupon_limit;
                vm.form.discount.status = 'active';
                vm.form.discount.codes_txt = vm.workingDiscount.codes_txt;
                vm.form.discount.codes_expire_at = vm.workingDiscount.codes_expire_at;
            } else if (vm.workingDiscountIndex == 1) {
                if (!angular.isDefined(vm.form.discount) || vm.form.discount == null) {
                    return;
                }

                vm.form.discount.value = vm.workingDiscount.value;
                vm.form.discount.value_type = vm.workingDiscount.value_type;
                vm.form.discount.coupon_limit = vm.workingDiscount.coupon_limit;
            }
        }

        function updateDiscountFormButton() {
            if (vm.workingDiscount == null) {
                return;
            }

            var allValid = true;
            // check value
            if (angular.isDefined(vm.workingDiscount.value)) {
                if (typeof vm.workingDiscount.value != 'string') {
                    if (parseFloat(vm.workingDiscount.value) <= 0.0) {
                        allValid = false;
                    }
                } else if (vm.workingDiscount.value.trim() == '') {
                    allValid = false;
                }
            } else {
                allValid = false;
            }
            // check coupon_limit
            if (angular.isDefined(vm.workingDiscount.coupon_limit)) {
                if (typeof vm.workingDiscount.coupon_limit != 'string') {
                    if (parseFloat(vm.workingDiscount.coupon_limit) <= 0.0) {
                        allValid = false;
                    }
                } else if (vm.workingDiscount.coupon_limit.trim() == '') {
                    allValid = false;
                }
            } else {
                allValid = false;
            }
            // check codes_txt, if add
            if (vm.workingDiscountIndex == -1) {
                if (angular.isDefined(vm.workingDiscount.codes_txt)) {
                    if (vm.workingDiscount.codes_txt.trim() == '') {
                        allValid = false;
                    }
                } else {
                    allValid = false;
                }
            }
            // check codes_expire_at, if add
            if (vm.workingDiscountIndex == -1) {
                if (angular.isDefined(vm.workingDiscount.codes_expire_at)) {
                    if (vm.workingDiscount.codes_expire_at.trim() == '') {
                        allValid = false;
                    }
                } else {
                    allValid = false;
                }
            }

            if (allValid) {
                vm.commitDiscountDisabled = false;
            } else {
                vm.commitDiscountDisabled = true;
            }
        }

        function setSaveMode(mode){
            vm.saveMode = mode;
            if(vm.formDeal.$invalid || vm.form.description.length > 50){
                HelperService.goToAnchor('msg-info');                
            }
        }
    }
})();
