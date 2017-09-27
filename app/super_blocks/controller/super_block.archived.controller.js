(function() {
    'use strict';

    angular.module('app.superblocks')
        .controller('SuperBlockArchivedController', SuperBlockArchivedController);

    SuperBlockArchivedController.$inject = ['SuperBlockService', '$state', '$scope', '$log', '$timeout'];

    /* @ngInject */
    function SuperBlockArchivedController(SuperBlockService, $state, $scope, $log, $timeout) {
        var vm = this;

        vm.response = {};
        vm.isLoading = false;

        vm.searchTerm = '';
        vm.filterSuperBlockStatus = 'archived';

        vm.currPage = 1;
        vm.totalSuperBlocks = 0;
        vm.superblocksPerPage = '10';
        vm.superblocks = [];

        vm.search = search;
        vm.startSearch = startSearch;
        vm.clearSearch = clearSearch;

        activate();

        ////////////////

        function activate() {
            startSearch();
        }

        function startSearch() {
            vm.currPage = 1;
            search();
        }

        function clearSearch() {
            vm.searchTerm = '';
            startSearch();
        }

        function search() {
            vm.superblocks = [];
            vm.isLoading = true;
            vm.searchTerm = vm.searchTerm.trim();

            SuperBlockService.search(vm.searchTerm, vm.filterSuperBlockStatus, vm.currPage, vm.superblocksPerPage).then(function(resp) {
                vm.superblocks = resp.super_blocks;
                vm.totalSuperBlocks = resp.total;
                vm.isLoading = false;
            }).catch(function(err) {
                $log.log(err);
                vm.isLoading = false;
            });
        }

    }
})();
