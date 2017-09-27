(function() {
    'use strict';

    angular.module('app.categories', [])
        .factory('CategoryService', CategoryService);

    CategoryService.$inject = ['$http', 'CONST', '$q', '$rootScope', '$log'];

    /* @ngInject */
    function CategoryService($http, CONST, $q, $rootScope, $log) {
        var api = CONST.api_domain + '/admin/categories';

        var service = {
            lists: [],
            errors: [],
            add: add,
            edit: edit,
            delete: _delete,
            getAll: getAll,
            find: find,
            findInList: findInList,
            isEmpty: isEmpty,
            search: search,
            searchedList: []
        }

        return service;

        //////// SERIVCE METHODS ////////

        function search(query, status) {
            var d = $q.defer();
            var q = query.toLowerCase().trim();
            var url = api + '?query=' + encodeURI(q) + '&status=' + status;

            $http.get(url).then(function(resp) {
                service.searchedList = resp.data.categories;
                d.resolve(resp.data.categories);

            }).catch(function(err) {
                $log.log(err);
                d.reject(err);
            });

            return d.promise;
        }

        function isEmpty() {
            if (!angular.isDefined(service.lists.categories)) {
                return true;
            }
            return service.lists.total == 0;
        }

        function findInList(id) {
            var d = $q.defer();
            if (angular.isDefined(id)) {
                if (!isEmpty()) {
                    var found = false;
                    angular.forEach(service.lists.categories, function(value, key) {
                        if (id == service.lists.categories[key].uid) {
                            found = true;
                            d.resolve(service.lists.categories[key]);
                        }
                    });
                    if (found == false) {
                        find(id).then(function(category) {
                            d.resolve(category);
                        }).catch(function(err) {
                            d.reject(err);
                        });
                    }
                } else {
                    find(id).then(function(category) {
                        d.resolve(category);
                    }).catch(function(err) {
                        d.reject(err);
                    });
                }
            } else {
                d.reject({data: {errors: ['Category does not exist.']}});
            }

            return d.promise;
        }

        function getAll() {
            var d = $q.defer();

            var req = {
                method: 'GET',
                url: api
            };

            $http(req)
                .then(function(data) {
                    service.lists = data.data;
                    d.resolve(data.data);
                })
                .catch(function(error) {
                    $log.log(error);
                    service.errors = error;
                    d.reject(error);
                });

            return d.promise;
        }

        function find(id) {
            var d = $q.defer();
            var url = api + '/' + id;
            $http({
                    method: 'GET',
                    url: url,
                    //params: {id: id}
                })
                .then(function(data) {
                    var category = data.data;
                    d.resolve(category);
                })
                .catch(function(error) {
                    service.errors = error;
                    d.reject(error);
                });

            return d.promise;
        }

        function add(data) {
            var url = api;
            var d = $q.defer();

            var category = {
              category: data
            };

            $http.post(url, category)
                .then(function(resp) {
                    //$log.log(resp);
                    d.resolve(resp);
                }).catch(function(error) {
                    $log.log(error);
                    service.errors = error;
                    d.reject(error);
                });

            return d.promise;
        }

        function edit(id, data) {
            var url = api + "/" + id;
            var d = $q.defer();

            console.log(data);

            var category = {
              category: data
            };

            $http.patch(url, category)
                .then(function(resp) {
                    d.resolve(resp);
                }).catch(function(error) {
                    $log.log(error);
                    service.errors = error;
                    d.reject(error);
                });

            return d.promise;
        }

        function _delete(id) {
            var url = api + "/" + id;
            var d = $q.defer();

            $http.delete(url, {})
                .then(function(resp) {
                    d.resolve(resp);
                }).catch(function(error) {
                    $log.log(error);
                    service.errors = error;
                    d.reject(error);
                });

            return d.promise;
        }
    }

})();
