(function() {
    'use strict';

    angular
        .module('app')
        .filter('secondsTohhmmss', secondsTohhmmss);

    function secondsTohhmmss() {
        return function(input) {
            if (!input) {
                return '00:00:00';
            }

            var totalSeconds = Math.round(input);

            var hours   = Math.floor(totalSeconds / 3600);
            var minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
            var seconds = totalSeconds - (hours * 3600) - (minutes * 60);

            // round seconds
            seconds = Math.round(seconds * 100) / 100

            var result = (hours < 10 ? "0" + hours : hours);
            result += ":" + (minutes < 10 ? "0" + minutes : minutes);
            result += ":" + (seconds  < 10 ? "0" + seconds : seconds);
            return result;
        }
    }
})();
