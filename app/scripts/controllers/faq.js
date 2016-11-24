'use strict';

/**
 * @ngdoc function
 * @name demoApp.controller:IndexCtrl
 * @description
 * # IndexCtrl
 * Controller of the demoApp
 */
angular.module('demoApp')

    .controller('FaqCtrl', [
        '$scope',
        '$timeout',
        '$state',
        'ssSideNav',
    
        function (
            $scope,
            $timeout,
            $state,
            ssSideNav,
            $mdOpenMenu) {
 
            $scope.model = {
                        title: 'FAQ Editor'
                    };
                

            var originatorEv;

            this.openMenu = function($mdOpenMenu, ev) {
              originatorEv = ev;
              $mdOpenMenu(ev);
            };

            this.notificationsEnabled = true;
            this.toggleNotifications = function() {
              this.notificationsEnabled = !this.notificationsEnabled;
            };

             this.redial = function() {
                  $mdDialog.show(
                    $mdDialog.alert()
                      .targetEvent(originatorEv)
                      .clickOutsideToClose(true)
                      .parent('body')
                      .title('Suddenly, a redial')
                      .textContent('You just called a friend; who told you the most amazing story. Have a cookie!')
                      .ok('That was easy')
                  );

                  originatorEv = null;
                };

                this.checkVoicemail = function() {
                  // This never happens.
                };
	   }
    ]);