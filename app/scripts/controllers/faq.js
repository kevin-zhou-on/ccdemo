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
        '$mdDialog',
        function (
            $scope,
            $timeout,
            $state,
            ssSideNav,
             $mdDialog
            ) {

        this.openFaqDialog = function(ev) {
           // console.log('open faq dialog ' + ev + $mdDialog);
            $mdDialog.show({
              controller: DialogController,
              templateUrl: 'views/faq_dialog.html',
              parent: angular.element(document.body),
              targetEvent: ev,
              clickOutsideToClose:true,
              fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            })
            .then(function(answer) {
              $scope.status = 'You said the information was "' + answer + '".';
            }, function() {
              $scope.status = 'You cancelled the dialog.';
            });
          };


           $scope.rowCollection = [
       
           { id: "1", Type: "Cat", Name: "Cat 1", Modified: '2016/03/01'},
            { id: "2", Type: "Cat", Name: "Cat 2", Modified: '2016/01/01'}, 
            { id: "3", Type: "Cat", Name: "Cat 3", Modified: '2016/01/02'},
            { id: "4", Type: "FAQ", Name: "FAQ 1", Modified: '2016/01/01'},
            { id: "5", Type: "FAQ", Name: "FAQ 2", Modified: '2016/03/01'},
            { id: "6", Type: "FAQ", Name: "FAQ 3", Modified: '2016/01/01'},
            { id: "7", Type: 'FAQ', Name: "FAQ 4", Modified: '2016/04/01'},
            { id: "8", Type: 'FAQ', Name: "FAQ 5", Modified: '2016/04/01'},
            { id: "9", Type: 'FAQ', Name: "FAQ 6", Modified: '2016/04/01'},
            { id: "10", Type: 'FAQ', Name: "FAQ 7", Modified: '2016/04/01'},
            { id: "11", Type: 'FAQ', Name: "FAQ 8", Modified: '2016/04/01'}
            
          ];

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


                function DialogController($scope, $mdDialog) {
                    $scope.hide = function() {
                      $mdDialog.hide();
                    };

                    $scope.cancel = function() {
                      $mdDialog.cancel();
                    };

                    $scope.answer = function(answer) {
                      $mdDialog.hide(answer);
                    };
                  }            
	   }
    ]);