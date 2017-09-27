(function() {
    'use strict';

    angular
        .module('app')
        .directive('sidebarSection', sidebarSection);

    function sidebarSection() {
        var directive = {
            restrict: 'E',
            link: function(scope) {
                Layout.init();
            },
            replace: true,
            templateUrl: "/app/nav/sidebar.html",
        };

        return directive;
    }

})();