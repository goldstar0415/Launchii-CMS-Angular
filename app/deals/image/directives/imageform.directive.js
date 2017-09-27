(function() {
    'use strict';

    angular
        .module('app.deals.image')
        .directive('imageForm', imageForm);

    imageForm.$inject = ['$compile', '$document', '$filter'];
    /* @ngInject */
    function imageForm($compile, $document, $filter) {

        var directive = {
            restrict: 'E',
            templateUrl: 'app/deals/image/imageform.html',
            replace: true,
            scope: {
                formImage: '=',
                formMode: '@',
                insertImg: '=',
                removeImage: '=',
                noBtn: '@'
            },
            link: function(scope, element, attrs) {
                scope.addNewImageObj = addNewImageObj;
                //scope.selFormImage = scope.formImage;
                scope.clearFile = clearFile;
                scope.fileIsBlank = fileIsBlank;
                scope.previewImage = previewImage;
                scope.closeForm = closeForm;

                ///////////

                function closeForm() {
                    if (scope.formMode == 'Edit') {
                        var filename64 = $filter('base64filename')(scope.formImage.file);
                        angular.element('#' + scope.formImage.uid).attr('src', filename64);
                    }
                }

                function previewImage(imgModel) {
                    var filename64 = $filter('base64filename')(imgModel);
                    var html = '<label>Preview:</label><div class="preview-image" ><img src="' + filename64 + '" style="border: 1px solid #f0f0f0;" /></div>';
                    var input = angular.element(html);
                    var compile = $compile(input)(scope);
                    angular.element(element).find('.form-image-preview').html(compile);
                }

                function fileIsBlank() {
                    if (scope.formMode == 'Edit') {
                        return !angular.isObject(scope.formImage.file);
                    } else {
                        return false;
                    }
                }

                function clearFile() {
                    scope.formImage.file = null;
                    scope.formImage.file = "";
                    scope.formImage.description = "";
                }

                function addNewImageObj() {
                    if (angular.isObject(scope.formImage.file)) {
                        var html = '<image-display sel-form-image="formImage" form-mode="formMode" remove-image="removeImage" insert-img="insertImg" ></image-display>';
                        var input = angular.element(html);
                        var compile = $compile(input)(scope);
                        //console.log(scope.selFormImage);
                        $('#image-display-container').append(compile);

                        angular.element(element).find('.form-image-preview').html('');
                        $('.fileinput').fileinput('clear');
                        $('.image-modal').modal('hide');
                    }
                }
            }
        };

        return directive;
    }

})();
