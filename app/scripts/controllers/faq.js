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
		'$mdEditDialog',
    'CoreService',
        function (
            $scope, $timeout, $state, ssSideNav, $mdDialog, $mdEditDialog,CoreService
            ) {

    

		  $scope.selected = [];
		  $scope.limitOptions = [25, 50, 100];
		  
		  $scope.options = {
			rowSelection: true,
			multiSelect: true,
			autoSelect: false,
			decapitate: false,
			largeEditDialog: false,
			boundaryLinks: false,
			limitSelect: true,
			pageSelect: true
		  };
		  
		  $scope.query = {
			order: 'type',
			limit: 25,
			page: 1
		  };
					
       this.goFaqHome = function(){
          CoreService.callAPIGet('admin/faq/home',function(result){
                  $scope.breadcrumb = [{ 'name' : 'Root', 'id' : ''}];

                  $scope.items = {
                    "count" : result.data.length,
                    "data"  : result.data
                    }           ;

                    
              });
       }

      this.goFaqHome();


       this.goback = function(){
           if($scope.breadcrumb.length > 1){
               $scope.breadcrumb.pop();
               var last = $scope.breadcrumb[$scope.breadcrumb.length -1];
               this.selectNode(true,last);
           }
       }

       this.selectNode = function(isback, node){
         if(node && node.id){
             if(isback){
                var last = $scope.breadcrumb[$scope.breadcrumb.length -1];
                while(last.id != node.id){
                    $scope.breadcrumb.pop();
                    last = $scope.breadcrumb[$scope.breadcrumb.length -1];
                }
             }

             CoreService.callAPIGet('admin/faq/cat/' + node.id,function(result){
             if(!isback) $scope.breadcrumb.push (node);

              $scope.items = {
                "count" : result.data.length,
                "data"  : result.data
                }           ;

                
          });
         }else{
           this.goFaqHome();
         }
       }

        this.drilldown = function(node){
            this.selectNode(false,node);
        }
			
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


       /*    $scope.items = {
                "count" : 11 ,
				"data"  : [
           { id: "1", type: "Cat",  name: "Cat 1", modified: '2016/03/01'},
            { id: "2", type: "Cat", name: "Cat 2", modified: '2016/01/01'}, 
            { id: "3", type: "Cat", name: "Cat 3", modified: '2016/01/02'},
            { id: "4", type: "FAQ", name: "FAQ 1", modified: '2016/01/01'},
            { id: "5", type: "FAQ", name: "FAQ 2", modified: '2016/03/01'},
            { id: "6", type: "FAQ", name: "FAQ 3", modified: '2016/01/01'},
            { id: "7", type: 'FAQ', name: "FAQ 4", modified: '2016/04/01'},
            { id: "8", type: 'FAQ', name: "FAQ 5", modified: '2016/04/01'},
            { id: "9", type: 'FAQ', name: "FAQ 6", modified: '2016/04/01'},
            { id: "10", type: 'FAQ', name: "FAQ 7", modified: '2016/04/01'},
            { id: "11", type: 'FAQ', name: "FAQ 8", modified: '2016/04/01'}
            
			]};
   */
		  
		  
		  $scope.logItem = function (item) {
			console.log(item.name, 'was selected');
		  };
		  
		  $scope.logOrder = function (order) {
			console.log('order: ', order);
		  };
		  
		  $scope.logPagination = function (page, limit) {
			console.log('page: ', page);
			console.log('limit: ', limit);
		  }		  
            $scope.model = {
                        title: 'FAQ Editor'
                    };
                

            var originatorEv;

            this.openMenu = function($mdOpenMenu, ev) {
              originatorEv = ev;
              $mdOpenMenu(ev);
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