'use strict';

/**
 * @ngdoc function
 * @name demoApp.controller:IndexCtrl
 * @description
 * # IndexCtrl
 * Controller of the demoApp
 */
angular.module('demoApp')
   .directive('treeView',['$compile', function($compile){
          return {
             restrict : 'A',
             link : function (scope,element, attrs){
               var treeId = attrs.treeId;
               var treeModel = attrs.treeView;
               var nodeId = attrs.nodeId || 'id';
	             //node label
				          var nodeLabel = attrs.nodeLabel || 'label';

		        		//children
				       var nodeChildren = attrs.children || 'children';

                var template =
                  '<ul>' +
                    '<li data-ng-repeat="node in ' + treeModel + '">' +
                      '<i class="collapsed" data-ng-show="node.' + nodeChildren + '.length && node.collapsed" data-ng-click="' + treeId + '.selectNodeHead(node)"></i>' +
                      '<i class="expanded" data-ng-show="node.' + nodeChildren + '.length && !node.collapsed" data-ng-click="' + treeId + '.selectNodeHead(node)"></i>' +
                      '<i class="normal" data-ng-hide="node.' + nodeChildren + '.length"></i> ' +
                      '<i class="fa fa-folder-open" style="color:rgb(2,136,209);" data-ng-if="node.node.type == \'c\'" aria-hidden="true"></i> ' +
                      '<i class="fa fa-file"  style="color:rgb(2,136,209);"  data-ng-if="node.node.type == \'f\'" aria-hidden="true"></i> ' +
                      '<span data-ng-class="node.selected" data-ng-click="' + treeId + '.selectNodeLabel(node)">{{node.' + nodeLabel + '}}</span>' +
                      '<div data-ng-hide="node.collapsed" data-tree-id="' + treeId + '" data-tree-view="node.' + nodeChildren + '" data-node-id=' + nodeId + ' data-node-label=' + nodeLabel + ' data-node-children=' + nodeChildren + '></div>' +
                    '</li>' +
                  '</ul>';

                    //check tree id, tree model
                     if( treeId && treeModel ) {

                        //root node
                        if( attrs.angularTreeview ) {
                        
                          //create tree object if not exists
                          scope[treeId] = scope[treeId] || {};

                        }

                        //Rendering template.
                        element.html('').append( $compile( template )( scope ) );
                      }                  

             }
          };
     }
   ])

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
			rowSelection: false,
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
      this.searching  = false;
      this.pasteSource = '' ; //cut , copy
					
      this.editMode = false;

       this.goFaqHome = function(){
          CoreService.callAPIGet('admin/faq/home',function(result){
                  $scope.breadcrumb = [{ 'name' : 'Root', 'id' : ''}];

                  $scope.items = {
                    "count" : result.data.length,
                    "data"  : result.data
                    }           ;

                    
              });
       };

      this.goFaqHome();

      this.toggleEdit = function(b){
         this.editMode = b;
         $scope.options.rowSelection = b;
         $scope.selected = [];
         this.pasteSource = '';
      };

      this.cut = function(){
         this.pasteSource = 'cut';
      };

      this.copy = function(){
         this.pasteSource = 'copy';
      };
 
      this.remove = function(){
         
      };

      this.search = function(){
         if(!that.searchtext) return;
         that.searching  = true;
         CoreService.callAPIGet('admin/faq/search/' + that.searchtext ,function(result){
                  $scope.items = {
                    "count" : result.data.length,
                    "data"  : result.data
                    }           ;
                    that.searching  = false;
          });
      }

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
        // this.toggleEdit(false);
         if(node && node.id){
             CoreService.callAPIGet('admin/faq/path/' + node.id,function(result){
                  $scope.breadcrumb = result.data;
                  $scope.breadcrumb.unshift({ 'name' : 'Root', 'id' : ''});

             });

             CoreService.callAPIGet('admin/faq/cat/' + node.id,function(result){

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
		
     this.pastePrompt = function(ev){
         if(!that.pasteSource) return ;
         var targetCat =  $scope.breadcrumb[$scope.breadcrumb.length - 1];
          
         var targetCatId = targetCat.id;
         var selectedItems = [];
         angular.forEach($scope.selected,function(value,key){
                    selectedItems.push(value);
         });

         var copyRequest = {
                    "selectedItems" : selectedItems,
                    "targetCatId"   : targetCatId,
                    "pasteSource"   : that.pasteSource,
                    "targetCat"     : targetCat
         };

        $mdDialog.show({
                  controller: DialogControllerPaste,
                  templateUrl: 'views/paste_confirm_dialog.html',
                  parent: angular.element(document.body),
                  targetEvent: ev,
                  clickOutsideToClose:true,
                  locals : {copyRequest : copyRequest},
                  fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
                })
                .then(function(answer) {
                  if ('ok' == answer)
                    that.paste(copyRequest);
                }, function() {
                   
                });         

     };

     this.paste = function(copyRequest){
         if(!that.pasteSource) return ;
       
              //cut, copy
          CoreService.callAPIPost('admin/faq/' + that.pasteSource  ,
                              copyRequest,
                              function(result){
                                    that.toggleEdit(false);
                                    that.refreshCurrentNode();
                                
                              },
                              function(result,status){
                                
                                    alert('error occurred.');
                                
                              }
                              
           ); 


       

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
		    //	console.log(item.name, 'was selected');
        //var index = $scope.selected.indexOf(item);
        //  $scope.selected.push({'id' : '3E9F8C9E-2EE6-7D2F-79C7-47BD8E327DA6'});

        if(item.type != 'c') return;
        CoreService.callAPIGet('admin/faq/selectCat/' + item.id ,function(result){
          angular.forEach(result.data,function(value,key){
              $scope.selected.push(value);
          });
           
        });

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
                  }       ; 

       function DialogControllerPaste($scope, $mdDialog, copyRequest) {
          $scope.copyRequest = copyRequest;
          var pctrl =  this;          

         

          this.sort = function(copyRequest){
              var r0 = [];
              var clonedselected = [];
              copyRequest.selectedItems.forEach(function(element){
                  var treeNode = {'node' : element,
                                  'children' : []  ,
                                   'v' : false };
                  if(!pctrl.findParent(element,copyRequest.selectedItems)){
                     treeNode.v = true;
                     r0.push(treeNode);
                  }else{
                     clonedselected.push(treeNode);
                  }
              }); 

              var buildTree = function(treeNode){
                  clonedselected.forEach(function(element){
                      if(element.v) return;
                      if(element.node.parentId == treeNode.node.id) {
                        treeNode.children.push(element);
                        element.v = true;
                      }
                  });

                  var i ;
                  for(i = 0; i< treeNode.children.length; i++){
                     buildTree(treeNode.children[i]);
                  }
              };

              var index;
              for(index=0; index < r0.length; index ++){
                  buildTree(r0[index]);
              }

              return r0;
          }; 
 
          this.findParent = function(node, list){
             var found = null;
             list.forEach(function(element) {
               if(element.id == node.parentId){
                   found = element;
               }
             }, this);

             return found;
          }; 

          $scope.treeModel = this.sort(copyRequest);

          $scope.ok = function() {
                       $mdDialog.hide('ok');
                   };

         $scope.cancel = function() {
                       $mdDialog.cancel();
                    };

               
        }       ;
 


	   }
    ]);