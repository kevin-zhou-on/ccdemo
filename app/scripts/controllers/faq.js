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

      this.searchMode = false;
      this.searchtext = '';
					
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
		
		this.addCatDialog = function(ev){
			var node = {id: null , type: 'c' , name: "" , parentMetaMsgCatId : $scope.breadcrumb[$scope.breadcrumb.length -1].id };
			this.openFaqDialog(ev, node);
		}
		
		this.addFaqDialog = function(ev){
			var node = {id: null , type: 'f' , name: "" , metaMsgCatId : $scope.breadcrumb[$scope.breadcrumb.length -1].id };
			this.openFaqDialog(ev, node);
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
                    controllerAs : 'faqDialogCtrl',
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
               var self = this;

			   if(selectedNode.id){
				   CoreService.callAPIGet('admin/faq/edit/msg/' + selectedNode.id ,function(result){
						$scope.faq = result.data ;

						$scope.nlpResponse = angular.fromJson($scope.faq.metaMsg);

					   /* $scope.nlpResponse = {
							"op" : "",
							"opd"  : "",
							"answer"   : "",
							"fn"       : ""
						};*/
				   });
			   }else{
				   $scope.faq = {
					   "faqKey": null,
					   "faqName": null,
					   "created":null,
					   "id": null,
					   "slotCnt":0,
					   "metaMsg":"Air",
					   "updated": null,
					   "weight":0,
					   "metaMsgCatId": selectedNode.metaMsgCatId 
				   };
				   
				   $scope.nlpResponse = {}
			   }


               //$scope.category = selectedNode; 
                    $scope.jsonResult = function(){
                        return JSON.stringify($scope.nlpResponse);
                    }
                    $scope.hide = function() {
                      $mdDialog.hide();
                    };

                    $scope.cancel = function() {
                      $mdDialog.cancel();
                    };

                    $scope.submit = function(faq,nlpResponse) {
                       if (!self.faqForm.$valid) {
                         //alert('please fix the input error');
                         //self.faqForm.$setDirty();
                         return;
                       }

                       faq.metaMsg = JSON.stringify(nlpResponse);
                        console && console.log(faq);
                        CoreService.callAPIPost('admin/faq/save/msg',
                          faq,
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
                            
			   if(selectedNode.id){
				   CoreService.callAPIGet('admin/faq/edit/cat/' + selectedNode.id ,function(result){
						$scope.category = result.data ;
				   });
			   }else{
				   $scope.category = { 
						"catKey":null,
						 "catName":null,
						 "created":null,
						 "id":null,
						 "nlpEngineId":null,
						 "parentMetaMsgCatId": selectedNode.parentMetaMsgCatId,
						 //"updated":"2016-11-08 21:42:27",
						 "weight":0
				   }
			   }


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