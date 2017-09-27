(function() {
    'use strict';

    angular.module('app')
        .factory('BreadCrumbService', BreadCrumbService);

    BreadCrumbService.$inject = [];

    /* @ngInject */
    function BreadCrumbService() {

        var service = {
            crumbs: [],
            set: set,
            getCrumbs: getCrumbs
        }

        return service;

        //////// SERIVCE METHODS ////////

        function getCrumbs() {
            return service.crumbs;
        }

        function set(str) {
            var res = str.split('.');
            var state = '';
            service.crumbs = [];
            angular.forEach(res, function(val, index) {
                if (index == 0) {
                    state = val;
                } else {
                    state += '.' + val;
                }

                var obj = { name: ucFirst(val), state: state };
                service.crumbs.push(obj);
            });
        }

        function ucFirst(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
    }

})();