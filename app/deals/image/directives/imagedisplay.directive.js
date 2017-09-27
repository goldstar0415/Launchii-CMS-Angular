(function() {
    'use strict';

    angular
        .module('app.deals.image')
        .directive('imageDisplay', imageDisplay);

    imageDisplay.$inject = ['$compile', '$filter'];
    /* @ngInject */
    function imageDisplay($compile, $filter) {

        var directive = {
            restrict: 'E',
            templateUrl: 'app/deals/image/imagedisplay.html',
            replace: true,
            scope: {
                selFormImage: '=',
                formMode: '=',
                removeImage: '=',
                insertImg: '=',
            },
            link: function(scope, element, attrs) {

                scope.remove = remove;
                scope.formImage = scope.selFormImage
                previewImage(scope.formImage.file);
                scope.insertImg();

                /////////////

                function previewImage(imgModel) {
                    var filename64 = $filter('base64filename')(imgModel);
                    var html = '<label>Preview:</label><div class="preview-image"><img src="' + filename64 + '" style="border: 1px solid #f0f0f0;" /></div>';
                    var input = angular.element(html);
                    var compile = $compile(input)(scope);
                    angular.element(element).find('.image-preview').html(compile);
                }

                function remove(elem, image) {
                    angular.element(elem).parents('.image-field-container').remove();
                    scope.removeImage(image);
                }
            }
        };

        return directive;
    }

})();
