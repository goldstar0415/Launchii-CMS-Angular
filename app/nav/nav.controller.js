(function() {
    'use strict';

    angular.module('app')
        .controller('NavController', NavController);

    NavController.$inject = ['$auth', '$rootScope', '$state', 'NavService']

    /* @ngInject */
    function NavController($auth, $rootScope, $state, NavService) {
        var vm = this;

        vm.navs = [];
        //vm.isState = isState;

        /////////////

        // function isState(stateName) {
        //     $state.includes(stateName);
        // }
    }
})();