(function() {
    'use strict';

    angular
        .module('app.deals.video', [])
        .directive('addVideo', addVideo);

    addVideo.$inject = ['$compile', '$document'];
    /* @ngInject */
    function addVideo($compile, $document) {

        var directive = {
            restrict: 'E',
            templateUrl: 'app/deals/video/video.html',
            replace: true,
            scope: {
                formVideo: '=',
                formMode: '=',
                insertVideo: '=',
                removeVideo: '='
            },
            link: function(scope, element, attrs) {
                scope.openModalForm = openModalForm;

                /////////////

                function openModalForm() {
                    angular.element(element).find('.video-modal').modal('show');
                }
            }
        };

        return directive;
    }

})();