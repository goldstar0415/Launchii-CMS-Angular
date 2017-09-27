(function() {
    'use strict';

    angular.module('app.superblocks')
        .controller('SuperBlockViewController', SuperBlockViewController);

    SuperBlockViewController.$inject = ['SuperBlockService', 'HelperService', '$stateParams', '$scope', 'prepSelSuperBlock', '$log'];

    /* @ngInject */
    function SuperBlockViewController(SuperBlockService, HelperService, $stateParams, $scope, prepSelSuperBlock, $log) {
        var vm = this;

        vm.mode = "View";
        vm.response = {};
        vm.superblockId = $stateParams.id;
        vm.superblock = prepSelSuperBlock;
        vm.isDone = false;

        vm.prevState = HelperService.getPrevState();

        activate();

        ///////////////////

        function activate() {
            angular.element('#superblock-content').html(vm.superblock.content);
        }
    }
})();
