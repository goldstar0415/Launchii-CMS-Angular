(function() {
    'use strict';

    angular.module('app.superblocks')
        .controller('SuperBlockEditController', SuperBlockEditController);

    SuperBlockEditController.$inject = ['SuperBlockService', 'HelperService', '$stateParams', '$scope', 'prepSelSuperBlock', '$state', '$log', 'froalaS3Info'];

    /* @ngInject */
    function SuperBlockEditController(SuperBlockService, HelperService, $stateParams, $scope, prepSelSuperBlock, $state, $log, froalaS3Info) {
        var vm = this;

        vm.mode = "Edit";
        vm.response = {};
        vm.superblockId = $stateParams.id;
        vm.selectedSuperBlock = prepSelSuperBlock;
        vm.form = vm.selectedSuperBlock;
        vm.isDone = true;

        vm.clearImage = clearImage;
        vm.previewImage = previewImage;

        vm.prevState = HelperService.getPrevState();
        vm.submitAction = editPost;

        vm.froalaS3Info = froalaS3Info.result;
        vm.froalaOptions = {
            // toolbarInline: true,
            imageUploadToS3: {
				bucket: vm.froalaS3Info.bucket,
				region: 's3-' + vm.froalaS3Info.region,
				keyStart: 'uploads/',
				params: {
					acl: 'public-read',
					AWSAccessKeyId: vm.froalaS3Info.aws_access_key_id,
					policy: vm.froalaS3Info.policy,
					signature: vm.froalaS3Info.signature
				}
			},
            videoUploadToS3: {
				bucket: vm.froalaS3Info.bucket,
				region: 's3-' + vm.froalaS3Info.region,
				keyStart: 'uploads/',
				params: {
					acl: 'public-read',
					AWSAccessKeyId: vm.froalaS3Info.aws_access_key_id,
					policy: vm.froalaS3Info.policy,
					signature: vm.froalaS3Info.signature
				}
			},
			requestWithCORS: true,
            pluginsEnabled: [
                'align','codeBeautifier', 'codeView', 'colors',
                'draggable', 'entities', 'fontFamily', 'fontSize',
                'image', 'inlineStyle', 'lineBreaker',
                'link', 'lists', 'paragraphFormat', 'paragraphStyle',
                'quote', 'table', 'video'],

            imageMaxSize: 1024 * 1024 * 5,
            videoInsertButtons: ['videoBack', '|', 'videoUpload'],
            events:{
                'froalaEditor.image.error' : function (e, editor, error, response) {
                    var $popup = editor.popups.get('image.insert');
                    var $layer = $popup.find('.fr-image-progress-bar-layer');
                    var message = (error.message) ? error.message : 'Something went wrong!';
                    $layer.find('h3').text(message);
                }
            }
        };

        activate();

        ///////////////////

        function activate() {
        }

        function previewImage() {
            var filebase64 = 'data:' + vm.form.image_file.filetype + ';base64,' + vm.form.image_file.base64;
            angular.element('#preview-image').html('<label>Image Preview:</label><div><img src="' + filebase64 + '" style="width: 250px; height: auto;border: 1px solid #f0f0f0;" /></div>');
        }

        function clearImage() {
            vm.form.image_file = null;
            angular.element('#preview-image').html('<label>Logo Preview:</label><div><img src="' + vm.form.image_url + '" style="width: 250px; height: auto;border: 1px solid #f0f0f0;" /></div>');
        }

        function editPost() {
            vm.isDone = false;

            if (vm.form.image_file) {
                vm.form.image = 'data:' + vm.form.image_file.filetype + ';base64,' + vm.form.image_file.base64;
            }

            SuperBlockService.edit(vm.superblockId, vm.form).then(function() {
                vm.response['success'] = "alert-success";
                vm.response['alert'] = "Success!";
                vm.response['msg'] = "Updated super block: " + vm.form.name;
                vm.isDone = true;

                $scope.$parent.vm.response = vm.response;
                $scope.$parent.vm.search();
                $state.go(vm.prevState);

            }).catch(function(err) {
                $log.log(err);
                vm.response['success'] = "alert-danger";
                vm.response['alert'] = "Error!";
                vm.response['msg'] = "Failed to update super block.";
                vm.response['error_arr'] = err.data == null ? '' : err.data.errors;
                vm.isDone = true;

                HelperService.goToAnchor('msg-info');
            });
        }
    }
})();
