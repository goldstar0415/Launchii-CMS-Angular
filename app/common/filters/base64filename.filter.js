(function() {
    'use strict';

    angular
        .module('app')
        .filter('base64filename', base64filename);

    function base64filename() {
        return function(img) {
            if (img) {
                var filebase64 = 'data:' + img.filetype + ';base64,' + img.base64;

                return filebase64;
            }

            return img;
        }

    }

})();