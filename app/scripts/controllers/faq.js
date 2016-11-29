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

      var that = this;
 

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

       this.refreshCurrentNode = function(){
            var last = $scope.breadcrumb[$scope.breadcrumb.length -1];
            this.selectNode(false,last);
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
			
        this.openFaqDialog = function(ev,node) {
           // console.log('open faq dialog ' + ev + $mdDialog);
            if(node.type == 'c'){
                $mdDialog.show({
                  controller: DialogControllerCat,
                  templateUrl: 'views/cat_dialog.html',
                  parent: angular.element(document.body),
                  targetEvent: ev,
                  clickOutsideToClose:true,
                  locals : {selectedNode : node},
                  fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
                })
                .then(function(answer) {
                  $scope.status = 'You said the information was "' + answer + '".';
                }, function() {
                  $scope.status = 'You cancelled the dialog.';
                });

            }else if(node.type == 'f'){
                 $mdDialog.show({
                    controller: DialogControllerFaq,
                    templateUrl: 'views/faq_dialog.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose:true,
                    locals : {selectedNode : node},
                    fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
                  })
                  .then(function(answer) {
                    $scope.status = 'You said the information was "' + answer + '".';
                  }, function() {
                    $scope.status = 'You cancelled the dialog.';
                  });

            }

          };

  
		  
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

             
      function DialogControllerFaq($scope, $mdDialog, selectedNode) {
                            
               CoreService.callAPIGet('admin/faq/edit/msg/' + selectedNode.id ,function(result){
                    $scope.faq = result.data ;
               });


               //$scope.category = selectedNode; 
                    
                    $scope.hide = function() {
                      $mdDialog.hide();
                    };

                    $scope.cancel = function() {
                      $mdDialog.cancel();
                    };

                    $scope.submit = function(category) {
                       console && console.log(category);
                        CoreService.callAPIPost('admin/faq/save/msg',
                          category,
                          function(result){
                             if(result.status == 'SUCCESS'){
                                 $mdDialog.hide();
                                 that.refreshCurrentNode();
                             }else{
                                 alert('error occurred.');
                             }
                          } 

                         
                         );


                        
                    };
                  }      ;      

       function DialogControllerCat($scope, $mdDialog, selectedNode) {
              CoreService.callAPIGet('common/dropdown/nlpengine',function(result){
                    $scope.nlpengineDropdown = result.data ;
               });
                            
               CoreService.callAPIGet('admin/faq/edit/cat/' + selectedNode.id ,function(result){
                    $scope.category = result.data ;
               });


               //$scope.category = selectedNode; 
                    
                    $scope.hide = function() {
                      $mdDialog.hide();
                    };

                    $scope.cancel = function() {
                      $mdDialog.cancel();
                    };

                    $scope.submit = function(category) {
                       console && console.log(category);
                        CoreService.callAPIPost('admin/faq/save/cat',
                          category,
                          function(result){
                             if(result.status == 'SUCCESS'){
                                 $mdDialog.hide();
                                 that.refreshCurrentNode();
                             }else{
                                 alert('error occurred.');
                             }
                          } 

                         
                         );


                        
                    };
                  }            
	   }
    ]);