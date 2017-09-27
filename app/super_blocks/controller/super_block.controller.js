(function() {
    'use strict';

    angular.module('app.superblocks')
        .controller('SuperBlockController', SuperBlockController);

    SuperBlockController.$inject = ['SuperBlockService', '$state', '$scope', '$log', '$timeout'];

    /* @ngInject */
    function SuperBlockController(SuperBlockService, $state, $scope, $log, $timeout) {
        var vm = this;

        vm.response = {};
        vm.isLoading = false;

        vm.searchTerm = '';
        vm.filterSuperBlockStatus = 'active';

        vm.currPage = 1;
        vm.totalSuperBlocks = 0;
        vm.superblocksPerPage = '10';
        vm.superblocks = [];

        vm.search = search;
        vm.startSearch = startSearch;
        vm.clearSearch = clearSearch;
        vm.archiveSuperBlock = archiveSuperBlock;

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

        function archiveSuperBlock(element, superblock) {
            bootbox.confirm({
                title: "Confirm Delete",
                message: "Are you sure you want to delete Super Block: <b>" + superblock.name + "</b>?",
                buttons: {
                    confirm: {
                        label: 'Yes',
                        className: 'btn-success'
                    },
                    cancel: {
                        label: 'No',
                        className: 'btn-danger'
                    }
                },
                callback: function(result) {
                    if (result) {
                        var ladda = Ladda.create(element);
                        ladda.start();
                        doDelete(superblock, ladda);
                    }
                }
            });

        }

        function doDelete(superblock, ladda) {
            SuperBlockService.delete(superblock.uid).then(function(resp) {
                vm.response['success'] = "alert-success";
                vm.response['alert'] = "Success!";
                vm.response['msg'] = "Archived Super Block: " + superblock.name;
                search();
                $timeout(function() {
                    vm.response.msg = null;
                }, 3000);
                ladda.remove();
            }).catch(function(err) {
                vm.response['success'] = "alert-danger";
                vm.response['alert'] = "Error!";
                vm.response['msg'] = "Can not archive Super Block: " + superblock.name;
                ladda.remove();
            });
        }
    }
})();
