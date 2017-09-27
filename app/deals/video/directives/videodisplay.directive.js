(function() {
    'use strict';

    angular
        .module('app.deals.video')
        .directive('videoDisplay', videoDisplay);

    videoDisplay.$inject = ['$compile', '$filter'];
    /* @ngInject */
    function videoDisplay($compile, $filter) {

        var directive = {
            restrict: 'E',
            templateUrl: 'app/deals/video/videodisplay.html',
            replace: true,
            scope: {
                selFormVideo: '=',
                formMode: '=',
                removeVideo: '=',
                insertVideo: '=',
            },
            link: function(scope, element, attrs) {

                scope.remove = remove;
                scope.formVideo = scope.selFormVideo
                previewVideo(scope.formVideo.embedded_content);
                previewImage(scope.formVideo.image_attributes.file);
                scope.insertVideo();

                /////////////

                function previewVideo(embedded_content) {
                    var html = embedded_content;
                    var input = angular.element(html);
                    var compile = $compile(input)(scope);
                    angular.element(element).find('.video-preview').html(compile);
                }


                function previewImage(imgModel) {
                    var filename64 = $filter('base64filename')(imgModel);
                    var html = '<label>Thumbnail Image:</label><div class="preview-image"><img src="' + filename64 + '" style="border: 1px solid #f0f0f0;" /></div>';
                    var input = angular.element(html);
                    var compile = $compile(input)(scope);
                    angular.element(element).find('.image-preview').html(compile);
                }


                function remove(elem, video) {
                    angular.element(elem).parents('.video-field-container').remove();
                    scope.removeVideo(video);
                }
            }
        };

        return directive;
    }

})();
