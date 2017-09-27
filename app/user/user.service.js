(function() {
    'use strict';

    angular.module('app.users', [])
        .factory('UserService', UserService);

    UserService.$inject = ['$http', 'CONST', '$q', '$rootScope', '$log'];

    /* @ngInject */
    function UserService($http, CONST, $q, $rootScope, $log) {
        var api = CONST.api_domain + '/admin/users';

        var service = {
            add: add,
            edit: edit,
            editMe: editMe,
            delete: _delete,
            getById: getById,
            search: search,
            send_confirm: send_confirm
        }

        return service;

        //////// SERIVCE METHODS ////////

        function search(str, role, page, limit) {

            var d = $q.defer();
            var q = str.toLowerCase().trim();
            var url = api + '?query=' + encodeURI(q) + '&role=' + role + '&page=' + page + '&limit=' + limit;

            $http.get(url).then(function(resp) {
                var result = resp.data;
                angular.forEach(result.users, function(user, index) {
                    if (user.is_admin) {
                        result.users[index]['role'] = 'admin';
                    } else if (user.is_vendor) {
                        result.users[index]['role'] = 'vendor';
                    } else if (user.is_customer) {
                        result.users[index]['role'] = 'customer';
                    } else {
                        result.users[index]['role'] = '';
                    }

                    result.users[index]['status'] = (user.is_active) ? 'active' : 'inactive';
                    result.users[index]['subscription_status'] = (user.is_free) ? 'free' : 'paid';
                });
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
                    var user = data.data;

                    if (user.is_admin) {
                        user['role'] = 'admin';
                    } else if (user.is_vendor) {
                        user['role'] = 'vendor';
                    } else if (user.is_customer) {
                        user['role'] = 'customer';
                    } else {
                        user['role'] = '';
                    }

                    user['status'] = (user.is_active) ? 'active' : 'inactive';
                    user['subscription_status'] = (user.is_free) ? 'free' : 'paid';

                    d.resolve(user);
                })
                .catch(function(error) {
                    d.reject(error);
                });

            return d.promise;
        }

        function add(data) {
            var url = api;
            var d = $q.defer();

            $http.post(url, data)
                .then(function(resp) {
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

            $http.patch(url, data)
                .then(function(resp) {
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
                    d.resolve(resp);
                }).catch(function(error) {
                    $log.log(error);
                    d.reject(error);
                });

            return d.promise;
        }

        function send_confirm(id) {
            var url = api + "/" + id + "/send_confirm_email";
            var d = $q.defer();

            $http.post(url, {})
                .then(function(resp) {
                    d.resolve(resp);
                }).catch(function(error) {
                    $log.log(error);
                    d.reject(error);
                });

            return d.promise;
        }


        function editMe(id, data){
            var url = CONST.api_domain + '/users/me';
            var d = $q.defer();

            $http.patch(url, data)
                .then(function(resp) {
                    d.resolve(resp);
                }).catch(function(error) {
                    $log.log(error);
                    d.reject(error);
                });

            return d.promise;
        }
    }

})();
