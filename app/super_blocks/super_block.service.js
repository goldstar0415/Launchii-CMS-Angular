(function() {
    'use strict';

    angular.module('app.superblocks', [])
        .factory('SuperBlockService', SuperBlockService);

    SuperBlockService.$inject = ['$http', 'CONST', '$q', '$rootScope', '$log'];

    /* @ngInject */
    function SuperBlockService($http, CONST, $q, $rootScope, $log) {
        var api = CONST.api_domain + '/admin/super_blocks';

        var service = {
            add: add,
            edit: edit,
            delete: _delete,
            getById: getById,
            search: search
        }

        return service;

        //////// SERIVCE METHODS ////////

        function search(query, status, page, limit) {
            var d = $q.defer();
            var q = query.toLowerCase().trim();

            var url = api + '?query=' + encodeURI(q) + '&status=' + status + '&page=' + page + '&limit=' + limit;

            $http.get(url).then(function(resp) {
                var result = resp.data;
                d.resolve(result);
            }).catch(function(err) {
                $log.log(err);
                d.reject(err);
            });

            return d.promise;
        }

        function getById(id) {
            var d = $q.defer();
            var url = api + '/' + id;
            $http({
                    method: 'GET',
                    url: url,
                })
                .then(function(data) {
                    var superblock = data.data;
                    d.resolve(superblock);
                })
                .catch(function(error) {
                    d.reject(error);
                });

            return d.promise;
        }

        function add(data) {
            var url = api;
            var d = $q.defer();

            var superblock = {
              super_block: data
            };

            $http.post(url, superblock)
                .then(function(resp) {
                    // $log.log(resp);
                    d.resolve(resp);
                }).catch(function(error) {
                    $log.log(error);
                    d.reject(error);
                });

            return d.promise;
        }

        function edit(id, data) {
            var url = api + "/" + id;
            var d = $q.defer();

            var superblock = {
              super_block: data
            };

            $http.patch(url, superblock)
                .then(function(resp) {
                    // $log.log(resp);
                    d.resolve(resp);
                }).catch(function(error) {
                    $log.log(error);
                    d.reject(error);
                });

            return d.promise;
        }

        function _delete(id) {
            var url = api + "/" + id;
            var d = $q.defer();

            $http.delete(url, {})
                .then(function(resp) {
                    $log.log(resp);
                    d.resolve(resp);
                }).catch(function(error) {
                    $log.log(error);
                    d.reject(error);
                });

            return d.promise;
        }
    }

})();
