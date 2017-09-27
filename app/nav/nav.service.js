(function() {
    'use strict';

    angular.module('app')
        .factory('NavService', NavService);

    NavService.$inject = ['$http', 'CONST', '$q'];

    /* @ngInject */
    function NavService($http, CONST, $q) {
        var api = CONST.api_domain + 'nav/';
        var d = $q.defer();

        var service = {
            navs: [],
            errors: [],
            //getNavs: getNavs
        }

        return service;

        ////////////////

        function getNavs() {
            /*
            var d = $q.defer();

            $http.get(api)
                .then(function(data) {
                    d.resolve(data.data);
                })
                .catch(function(error) {
                    service.errors = error;
                    d.reject();
                });

            return d.promise;
            */
        }
    }

})();