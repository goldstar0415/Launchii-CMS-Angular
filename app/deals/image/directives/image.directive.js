(function() {
    'use strict';

    angular
        .module('app.deals.image', [])
        .directive('addImage', addImage);

    addImage.$inject = ['$compile', '$document'];
    /* @ngInject */
    function addImage($compile, $document) {

        var directive = {
            restrict: 'E',
            templateUrl: 'app/deals/image/image.html',
            replace: true,
            scope: {
                formImage: '=',
                formMode: '=',
                insertImg: '=',
                removeImage: '='
            },
            link: function(scope, element, attrs) {
                scope.openModalForm = openModalForm;

                /////////////

                function openModalForm() {
                    angular.element(element).find('.image-modal').modal('show');
                    //$('#image-modal').modal('show');
                }
            }
        };

        return directive;
    }

})();