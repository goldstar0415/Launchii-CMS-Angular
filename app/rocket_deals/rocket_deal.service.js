(function() {
    'use strict';

    angular.module('app.rocketDeals', [])
        .factory('RocketDealService', RocketDealService);

    RocketDealService.$inject = ['$http', 'CONST', '$q', '$rootScope', '$log', 'DealService'];

    /* @ngInject */
    function RocketDealService($http, CONST, $q, $rootScope, $log, DealService) {
        var api = CONST.api_domain + '/admin/rocket_deals';

        var service = {
            add: add,
            edit: edit,
            delete: _delete,
            getById: getById,
            search: search,
            approve: approve,
            reject: reject
        }

        return service;

        //////// SERIVCE METHODS ////////

        function search(query, status, ignore_status, page, limit) {
            var d = $q.defer();
            var q = query.toLowerCase().trim();

            var url = api + '?query=' + encodeURI(q) + '&status=' + status + '&ignore_status=' + ignore_status + '&page=' + page + '&limit=' + limit;

            $http.get(url).then(function(resp) {
                var tasks = [];                
                var result = resp.data;

                angular.forEach(result.rocket_deals, function(rocket_deal, index) {
                    tasks.push(function(cb) {
                        DealService.find(rocket_deal.deal_id).then(function(deal) {
                            result.rocket_deals[index]['deal_token'] = deal.token;
                            cb(null, deal);
                        }).catch(function(err) {
                            result.deals[index]['deal_token'] = null;
                            cb(null, null);
                        });

                    });                    
                });
                
                async.parallel(tasks, function(error, results) {
                    if (error) {
                        $log.log(error);
                        d.reject(error);
                    } else {
                        d.resolve(result);
                    }

                });

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
                    var rocketDeal = data.data;
                    d.resolve(rocketDeal);
                })
                .catch(function(error) {
                    d.reject(error);
                });

            return d.promise;
        }

        function add(data) {
            var url = api;
            var d = $q.defer();

            var rocketDeal = {
              rocket_deal: data
            };

            $http.post(url, rocketDeal)
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

            var rocketDeal = {
              rocket_deal: data
            };

            $http.patch(url, rocketDeal)
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
            console.log(id);
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

        function approve(id){
            var url = api + '/' + id + '/approve';
            var d = $q.defer();

            $http.patch(url, {}).then(function(resp) {
                d.resolve(resp);
            }).catch(function(err) {
                $log.log(err);
                d.reject(err);
            });

            return d.promise;
        }

        function reject(id, body){
            var url = api + '/' + id + '/reject';
            var d = $q.defer();

            $http.patch(url, body).then(function(resp) {
                d.resolve(resp);
            }).catch(function(err) {
                $log.log(err);
                d.reject(err);
            });

            return d.promise;
        }
    }

})();
