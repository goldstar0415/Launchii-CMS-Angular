(function() {
    'use strict';

    angular.module('app')
        .factory('DashboardService', DashboardService);

    DashboardService.$inject = [
        '$http',
        'CONST',
        '$q',
        '$rootScope',
        '$filter',
        '$log'
    ];

    /* @ngInject */
    function DashboardService(
        $http,
        CONST,
        $q,
        $rootScope,
        $filter,
        $log) {

        var api = CONST.api_domain + '/admin/dashboard';

        var service = {
            fetchSummary: fetchSummary,
            getGAReportingData: getGAReportingData,
            getGADateRange: getGADateRange,
            getFroalaS3Info: getFroalaS3Info
        }

        return service;

        function fetchSummary() {
            var d = $q.defer();

            $http.get(api).then(function(resp) {
                d.resolve(resp.data);
            }).catch(function(err) {
                d.reject(err);
            });

            return d.promise;
        }

        function getGAReportingData(type) {
            var d = $q.defer();

            var url = '/ga-reporting-data?type=' + type;

            $http.get(url).then(function(resp) {
                d.resolve(resp.data);
            }).catch(function(err) {
                $log.log(err);
                d.reject(err);
            });

            return d.promise;
        }

        function getGADateRange() {
            var d = $q.defer();

            var url = '/ga-date-range';

            $http.get(url).then(function(resp) {
                d.resolve(resp.data);
            }).catch(function(err) {
                $log.log(err);
                d.reject(err);
            });

            return d.promise;
        }

        function getFroalaS3Info() {
            var d = $q.defer();
            var url = '/froala-s3-info';

            $http.get(url).then(function(resp) {
                d.resolve(resp.data);
            }).catch(function(err) {
                $log.log(err);
                d.reject(err);
            });

            return d.promise;
        }

    }

})();
