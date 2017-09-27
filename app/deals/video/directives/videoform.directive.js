(function() {
    'use strict';

    angular
        .module('app.deals.video')
        .directive('videoForm', videoForm);

    videoForm.$inject = ['$compile', '$document', '$filter'];
    /* @ngInject */
    function videoForm($compile, $document, $filter) {

        var directive = {
            restrict: 'E',
            templateUrl: 'app/deals/video/videoform.html',
            replace: true,
            scope: {
                formVideo: '=',
                formMode: '@',
                insertVideo: '=',
                removeVideo: '=',
                noBtn: '@'
            },
            link: function(scope, element, attrs) {
                scope.addNewVideoObj = addNewVideoObj;

                scope.videoIsInvalid = videoIsInvalid;
                scope.previewVideo = previewVideo;
                scope.closeForm = closeForm;
                scope.previewImage = previewImage;
                
                if(scope.formMode == 'View') {

                    var html = scope.formVideo.embedded_content;
                    var input = angular.element(html);
                    var compile = $compile(input)(scope);
                    angular.element(element).find('.form-video-preview').html(compile);
                }

                // scope.formVideo.source_type = 'embed';
                ///////////

                function closeForm() {
                    // player = new YT.Player('existing-iframe-example', {
                    //     events: {
                    //       'onReady': onPlayerReady,
                    //       'onPlayerStateChangeeChange': onPlayerStateChange
                    //     }
                    // });
                    // player.stopVideo()
                    $('.video-modal').modal('hide');
                }

                function videoIsInvalid(){
                    return false;
                }
                
                function previewVideo(embed_code) {

                    var html = embed_code;
                    var input = angular.element(html);
                    var compile = $compile(input)(scope);
                    angular.element(element).find('.form-video-preview').html(compile);

                }


                function previewImage(imgModel) {
                    var filename64 = $filter('base64filename')(imgModel);
                    var html = '<label>Preview Thumbnail Image:</label><div class="preview-image" ><img src="' + filename64 + '" style="border: 1px solid #f0f0f0;" /></div>';
                    var input = angular.element(html);
                    var compile = $compile(input)(scope);
                    angular.element(element).find('.form-image-preview').html(compile);
                }

                function clearFile() {
                }

                function addNewVideoObj() {
                    if ((/<iframe [\s\S]*youtube[\s\S]*><\/iframe>/i.test(scope.formVideo.embedded_content)) && 
                       (angular.isObject(scope.formVideo.image_attributes.file))) {
                        var html = '<video-display sel-form-video="formVideo" form-mode="formMode" remove-video="removeVideo" insert-video="insertVideo" ></video-display>';
                        var input = angular.element(html);
                        var compile = $compile(input)(scope);
                        $('#video-display-container').append(compile);

                        angular.element(element).find('.form-video-preview').html('');
                        angular.element(element).find('.form-image-preview').html('');
                        $('.fileinput').fileinput('clear');

                        closeForm();
                    }
                }
            }
        };

        return directive;
    }

})();
