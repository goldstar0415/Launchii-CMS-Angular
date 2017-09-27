(function() {
    'use strict';

    angular.module('app.deals')
        .controller('DealEditController', DealEditController);

    DealEditController.$inject = [
        'DealService',
        'UserService',
        'BrandService',
        '$stateParams',
        '$scope',
        'prepSelDeal',
        'HelperService',
        '$state',
        'prepDealType',
        'brandPrepService',
        'categoryPrepService',
        'prepSelVariants',
        'prepActiveStandardD',
        'prepDealImages',
        'prepDealVideos',
        '$filter',
        '$log',
        '$timeout'
    ];

    /* @ngInject */
    function DealEditController(DealService,
        UserService,
        BrandService,
        $stateParams,
        $scope,
        prepSelDeal,
        HelperService,
        $state,
        prepDealType,
        brandPrepService,
        categoryPrepService,
        prepSelVariants,
        prepActiveStandardD,
        prepDealImages,
        prepDealVideos,
        $filter,
        $log,
        $timeout
    ) {

        var vm = this;

        vm.mode = "Edit";
        vm.response = {};
        vm.dealId = $stateParams.id;
        vm.selectedDeal = prepSelDeal;
        vm.form = vm.selectedDeal;
        vm.form.deal_type = prepDealType;
        vm.form.variants = [];
        vm.isDone = true;
        vm.brands = brandPrepService.brands;
        vm.default = vm.selectedDeal.brand_id;
        vm.categories = categoryPrepService.categories;
        vm.defaultCategory = vm.selectedDeal.category_id;

        vm.priceFormat = priceFormat;

        //discount
        vm.activeDiscounts = prepActiveStandardD;
        vm.discount = (angular.isDefined(vm.activeDiscounts) && vm.activeDiscounts.length > 0) ? vm.activeDiscounts[0] : null;
        vm.form.discount = null;
        vm.workingDiscountIndex = -1;       // -1 for add, 0 for edit existing one, 1 for edit new one
        vm.workingDiscount = null;
        vm.commitDiscountDisabled = true;

        vm.openDiscountModal = openDiscountModal;
        vm.removeNewDiscount = removeNewDiscount;
        vm.onDiscountCommitted = onDiscountCommitted;

        vm.upsellDeals = [];

        //images
        vm.form.file = [];
        vm.images = prepDealImages;
        vm.removeImage = removeImage;
        vm.removedImageObj = [];
        vm.imageCounter = 0;
        vm.getImageCounter = getImageCounter;
        vm.insertNewImageObj = insertNewImageObj;
        vm.latestImgIndex = latestImgIndex;
        vm.blankFn = blankFn;
        vm.openEditImageModal = openEditImageModal;
        vm.removeAddedImage = removeAddedImage;

        vm.updateDateDiff = updateDateDiff;
        vm.prevState = HelperService.getPrevState();
        vm.submitAction = editDeal;

        //videos
        vm.form.videos = [];
        if (typeof prepDealVideos == 'object'  && prepDealVideos.length >= 1){

            vm.videos = prepDealVideos.map(function(video){
                var obj = angular.copy(video);
                obj.source_type = video.is_embedded ? 'embed' : 'local';
                obj.attachment = '';
                obj.image_attributes = {
                    description: '',
                    file: ''
                };
                obj.modified = false;
                return obj;
            });
        }
        vm.removeVideo = removeVideo;
        vm.removedVideoObj = [];
        vm.videoCounter = 0;
        vm.insertNewVideoObj = insertNewVideoObj;
        vm.latestVideoIndex = latestVideoIndex;
        vm.blankFn = blankFn;
        vm.openEditVideoModal = openEditVideoModal;
        vm.removeAddedVideo = removeAddedVideo;

        // vendors
        vm.vendors = [];

        // variants
        vm.variants = prepSelVariants;
        vm.finalVariants = [];
        vm.removedVariantObjs = [];
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

            // mark already existing variants
            angular.forEach(vm.variants, function(variant, index) {
              variant['isOld'] = true;
              vm.finalVariants.push(variant);
            });

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

            priceFormat();
        }

        function initDateTimePickers() {
            var datePickerOptions = {
                autoclose: true,
                format: 'yyyy-mm-dd'
            };
            var timePickerOptions = {
                defaultTime: false,
                autoclose: true,
                showSeconds: true,
                minuteStep: 1
            }
            $('#deal-start-date').datepicker(datePickerOptions);
            $('#deal-end-date').datepicker(datePickerOptions);
            $('#discount-expire-date').datepicker(datePickerOptions);
            $('#deal-start-date').datepicker('setStartDate', new Date());
            $('#deal-end-date').datepicker('setStartDate', new Date(vm.form.date_starts));
            $('#discount-expire-date').datepicker('setStartDate', new Date());
            $('#deal-start-time').timepicker(timePickerOptions);
            $('#deal-end-time').timepicker(timePickerOptions);
        }

        function getVendors(){
            UserService.search('', 'vendor', 1, 500).then(function(resp) {
                vm.vendors = resp.users;
            });
        }

        function removeAddedImage(image) {
            angular.forEach(vm.form.file, function(img, index) {
                if (img === image) {
                    vm.form.file.splice(index, 1);
                }
            });
        }

        function openEditImageModal(elem) {
            $(elem).parents('.image-view-container').find('.image-modal').modal('show');
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

        function getFormImage() {
            //var index = getImageCounter();

            vm.form.file[vm.imageCounter] = {
                file: "",
                description: ""
            };

            return vm.form.file[vm.imageCounter++];
        }

        function getImageCounter() {
            return vm.imageCounter++;
        }

        function removeImage(elem, image) {
            vm.removedImageObj.push(image);
            $(elem).parents('.image-view-container').remove();
        }

        function countValidImages() {
          var count = 0;
          angular.forEach(vm.form.file, function(img, index) {
            if (img.file !== undefined && img.file != null &&
                img.file !== "" && angular.isObject(img.file)) {
              count ++;
            }
          });
          angular.forEach(vm.images, function(img, index) {
            count ++;
          });
          angular.forEach(vm.removedImageObj, function(img, index) {
            count --;
          });
          return count;
        }

        //Videos
        function removeAddedVideo(selvideo) {
            angular.forEach(vm.form.videos, function(video, index) {
                if (selvideo === video) {
                    vm.form.videos.splice(index, 1);
                }
            });
        }

        function openEditVideoModal(elem, video) {
            video.modified = true;
            $(elem).parents('.video-view-container').find('.video-modal').modal('show');
        }

        function blankFn() {
            return false;
        }

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


        function removeVideo(elem, video) {
            vm.removedVideoObj.push(video);
            $(elem).parents('.video-view-container').remove();
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

        function editDeal() {
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
                vm.form.discount == null && vm.discount == null) {
              bootbox.alert({
                  title: "No active discount!",
                  message: "Please create an active discount to publish the deal."
              });
              vm.isDone = true;
              return false;
            }

            // process variants
            vm.form.variants = [];
            vm.variants = [];
            angular.forEach(vm.finalVariants, function(variant, index) {
              if (angular.isDefined(variant.isOld) && variant.isOld == true) {
                vm.variants.push(variant);
              } else {
                vm.form.variants.push(variant);
              }
            });

            vm.form.starts_at = HelperService.combineDateTime(vm.form.date_starts, vm.form.time_starts);
            vm.form.ends_at = HelperService.combineDateTime(vm.form.date_ends, vm.form.time_ends);

            var data = {
                form: vm.form,
                variants: vm.variants,
                removedVariants: vm.removedVariantObjs,
                discount: vm.discount,
                images: vm.images,
                removedImages: vm.removedImageObj,
                videos: vm.videos,
                removedVideos: vm.removedVideoObj
            };

            DealService.edit(vm.dealId, data).then(function() {
                vm.response['success'] = "alert-success";
                vm.response['alert'] = "Success!";
                vm.response['msg'] = "Updated deal: " + vm.form.name;
                vm.isDone = true;

                if(vm.saveMode == 'design'){
                    if (vm.form.deal_type == 'upsell'){
                        $state.go('dashboard.upsell.design', {id: vm.dealId});
                    } else {
                        $state.go('dashboard.deal.design', {id: vm.dealId});
                    }
                } else if (vm.saveMode == 'finish'){
                    $scope.$parent.vm.search();
                    $state.go(vm.prevState);
                }

            }).catch(function(err) {
                $log.log(err);
                vm.response['success'] = "alert-danger";
                vm.response['alert'] = "Error!";
                vm.response['msg'] = "Failed to update deal.";
                vm.response['error_arr'] = err.data == null ? '' : err.data.errors;
                vm.isDone = true;

                HelperService.goToAnchor('msg-info');

            });
        }

        ////////////////////////////////////////////////////////////////////
        //                          For Variants                          //
        ////////////////////////////////////////////////////////////////////
        function removeVariant(variant_index) {
            if (variant_index < 0 || variant_index >= vm.finalVariants.length) {
                return;
            }
            var removedArray = vm.finalVariants.splice(variant_index, 1);
            var removedVariant = removedArray[0];
            if (angular.isDefined(removedVariant.isOld) && removedVariant.isOld === true) {
                vm.removedVariantObjs.push(removedVariant);
            }
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

            } else if (index == 0) {    // Edit existing discount

                if (!angular.isDefined(vm.discount) || vm.discount == null) {
                    return;
                }
                vm.workingDiscount = {};
                vm.workingDiscount.value = vm.discount.value;
                vm.workingDiscount.value_type = vm.discount.value_type;
                vm.workingDiscount.coupon_limit = vm.discount.coupon_limit;

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
            if (angular.isDefined(vm.discount) && vm.discount != null) {
                vm.discount.status = 'active';
            }
        }

        function onDiscountCommitted() {
            if (vm.workingDiscountIndex == -1) {        // Add discount

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

                if (angular.isDefined(vm.discount) && vm.discount != null) {
                    vm.discount.status = 'suspended';
                }

            } else if (vm.workingDiscountIndex == 0) {  // Edit existing discount

                if (!angular.isDefined(vm.discount) || vm.discount == null) {
                    return;
                }
                vm.discount.value = vm.workingDiscount.value;
                vm.discount.value_type = vm.workingDiscount.value_type;
                vm.discount.coupon_limit = vm.workingDiscount.coupon_limit;

            } else if (vm.workingDiscountIndex == 1) {  // Edit new discount

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
