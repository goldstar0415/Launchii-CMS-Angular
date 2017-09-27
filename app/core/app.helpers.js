(function() {
    'use strict';

    angular.module('app.helpers', [])
        .factory('HelperService', HelperService);

    HelperService.$inject = ['$state', '$rootScope', '$document', 'SmoothScroll'];

    /* @ngInject */
    function HelperService($state, $rootScope, $document, SmoothScroll) {
        var service = {
            getCurrentState: getCurrentState,
            getPrevState: getPrevState,
            removeFromList: removeFromList,
            addToList: addToList,
            refreshList: refreshList,
            emptyList: emptyList,
            setCss: setCss,
            setPageTitle: setPageTitle,
            goToAnchor: goToAnchor,
            getDateNow: getDateNow,
            combineDateTime: combineDateTime,
            convertToDateTime: convertToDateTime,
            setErrorStr: setErrorStr,
            capFirstLetter: capFirstLetter,
            checkValidHexColor: checkValidHexColor,
            changeGADateFormat: changeGADateFormat
        }

        return service;

        ////////////////

        function setErrorStr(err) {
            var errorStr = '';
            if (err.data != null) {
              angular.forEach(err.data.errors, function(error, index, arr) {
                  if (index === arr.length - 1) { //last iteration
                      errorStr += error;
                  } else {
                      errorStr += error + ', ';
                  }
              });
            }

            return errorStr;
        }

        function convertToDateTime(datetime) {
            var toDate = new Date(datetime);
            var dd = toDate.getDate();
            var mm = toDate.getMonth() + 1; //January is 0!
            var yyyy = toDate.getFullYear();

            var hh = toDate.getHours();
            var m = toDate.getMinutes();
            var s = toDate.getSeconds();
            var d = "AM";
            var h = hh;

            if (dd < 10) {
                dd = '0' + dd
            }

            if (mm < 10) {
                mm = '0' + mm
            }

            if (h >= 12) {
                h = hh - 12;
                d = "PM";
            }
            if (h == 0) {
                h = 12;
            }
            h = h < 10 ? "0" + h : h;
            m = m < 10 ? "0" + m : m;
            s = s < 10 ? "0" + s : s;

            var date = yyyy + '-' + mm + '-' + dd;
            var time = h + ':' + m + ':' + s + ' ' + d;

            var cDateTime = { date: date, time: time };

            return cDateTime;
        }

        function combineDateTime(date, time) {
          var dateTime = new Date(date);

          var hours = Number(time.match(/^(\d+)/)[1]);
          var minutes = Number(time.match(/:(\d+)/)[1]);
          var seconds = Number(time.match(/:(\d+):(\d+)/)[2]);
          var AMPM = time.match(/([AaPp][Mm])$/)[1];
          if ('pm' === AMPM.toLowerCase()) {
            hours += 12;
          }

          dateTime.setHours(hours);
          dateTime.setMinutes(minutes);
          dateTime.setSeconds(seconds);

          return dateTime.toJSON().toString();
        }

        function getDateNow() {
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth() + 1; //January is 0!
            var yyyy = today.getFullYear();

            if (dd < 10) {
                dd = '0' + dd
            }

            if (mm < 10) {
                mm = '0' + mm
            }

            return yyyy + '-' + mm + '-' + dd;
        }

        function goToAnchor(anchor) {
            // var newHash = anchor;
            // if ($location.hash() !== newHash) {
            //     // set the $location.hash to `newHash` and
            //     // $anchorScroll will automatically scroll to it
            //     $location.hash(anchor);
            // } else {
            //     // call $anchorScroll() explicitly,
            //     // since $location.hash hasn't changed
            //     $anchorScroll();
            // }
            // var top = 400;
            // var duration = 2000; //milliseconds

            // //Scroll to the exact position
            // $document.scrollTop(top, duration).then(function() {
            //     console && console.log('You just scrolled to the top!');
            // });

            // var elem = angular.element(document.getElementById(anchor));
            // console.log(elem);
            // $document.scrollToElement(elem);
            SmoothScroll.scrollTo('msg-info');
        }

        function setPageTitle(title) {
            $rootScope.page_title = title;
        }

        //css is an array e.g. ['/templates/assets/layouts/layout/css/layout.min.css']
        function setCss(css) {
            $rootScope.stylesheets = [];
            $rootScope.stylesheets = css;
        }

        function getCurrentState() {
            return $state;
        }

        function getPrevState() {
            var prevState = $state.current.parent;

            if (typeof prevState != 'undefined') {
                return prevState;
            }

            return false;
        }

        function removeFromList(list, id) {
            for (var x = 0; x < list.length; x++) {
                if (list[x].id == id) {
                    list.splice(x, 1);
                }
            }

            return list;
        }

        function addToList(list, newData) {
            list.push(newData);

            return list;
        }

        function refreshList(list, data) {
            list.splice(0, list.length);

            for (var x = 0; x < data.length; x++) {
                list.push(data[x]);
            }

            return list;
        }

        function emptyList(list) {
            list.splice(0, list.length);

            return list;
        }

        function capFirstLetter(input) {
          return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
        }

        function checkValidHexColor(input) {
            return (/^#[0-9A-F]{6}$/i.test(input));
        }

        function changeGADateFormat(dateString) {
            if (!angular.isDefined(dateString) || dateString == null) {
                return '';
            }
            if (typeof dateString !== 'string') {
                return '';
            }
            if (dateString.length != 8) {
                return '';
            }

            var year = parseInt(dateString.substring(0, 4));
            var month = parseInt(dateString.substring(4, 6));
            var date = parseInt(dateString.substring(6));
            if (isNaN(year) || isNaN(month) || isNaN(date)) {
                return '';
            }

            var dateObject = new Date(year, month - 1, date);
            if (isNaN(dateObject.getTime())) {
                return '';
            }

            var dd = dateObject.getDate();
            var mm = dateObject.getMonth() + 1; //January is 0!
            var yyyy = dateObject.getFullYear();

            if (dd < 10) {
                dd = '0' + dd
            }
            if (mm < 10) {
                mm = '0' + mm
            }

            return (mm + '-' + dd);
        }

    }

})();
