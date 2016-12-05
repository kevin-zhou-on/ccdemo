"use strict";function CoreService(a,b,c){this.supportedLanguages=["en","fr"],this.apiServerURL=a.apiServerUrl,this.callAPIGet=function(d,e,f){a.apiCall.count=a.apiCall.count+1,a.clearMessage();var g=this.apiServerURL+d;b.get(g,{}).success(function(b,c,d,g){a.apiCall.count=a.apiCall.count-1,"SUCCESS"==b.status?null!=e?e(b):a.debuglog("CoreService.callAPIGet: result is not set due to onSussessFunc is null."):(a.setMessage(!0,"API call unsuccessful:"+b.status+", "+b.message),null!=f?f(b,c):a.debuglog("CoreService.callAPIGet: unsuccessful result is not processed due to onErrorFunc is null."))}).error(function(b,d,e,g){a.apiCall.count=a.apiCall.count-1,a.setMessage(!0,"API Error, status code: "+d),a.debuglog("Get error, status code:"+d+", "+b),"-1"==d&&a.setMessage(!0,"Unable to connect to API server "+a.apiServerUrl),"401"==d?c.location.href=a._loginUrl:"403"==d&&(b.code?a.handleAPIError(b.code):a.setMessage(!0,"You do not have permission to perform the requested function")),null!=f&&f(b,d)})},this.callAPIPost=function(d,e,f,g){a.debuglog("CoreService.callAPIPost:"+d),a.apiCall.count=a.apiCall.count+1,a.clearMessage();var h=this.apiServerURL+d;a.debuglog("CoreService.callAPIPost:"+h);var i={headers:{}};b.post(this.apiServerURL+d,e,i).success(function(b,c,d,e){a.apiCall.count=a.apiCall.count-1,"SUCCESS"==b.status?f?f(b):a.debuglog("CoreService.callAPIPost: result is not set due to onSussessFunc is null."):(a.setMessage(!0,"API call unsuccessful:"+b.status+", "+b.message),g?g(b,c):a.debuglog("CoreService.callAPIPost: unsuccessful result is not processed due to onErrorFunc is null."))}).error(function(b,d,e,f){a.apiCall.count=a.apiCall.count-1,a.debuglog("Post error, status code:"+d+", "+JSON.stringify(b)),"-1"==d&&a.setMessage(!0,"Unable to connect to API server "+a.apiServerUrl),"401"==d&&(c.location.href=a._loginUrl),"403"==d?b.code?a.handleAPIError(b.code):a.setMessage(!0,"You do not have permission to perform the requested function"):"406"==d||"400"==d?b.code?a.handleAPIError(b.code):a.setMessage(!0,"Validation Error:"+b.message):"409"==d?a.setMessage(!0,"You are updating a stale copy of data, or aonther user has modified the data. Please reload this page."):a.setMessage(!0,"API Error, status code: "+d),g?g(b,d):a.debuglog("CoreService.callAPIPost: no user error hanlder specified.")})}}var app=angular.module("demoApp",["ngAnimate","ngAria","ngCookies","ngMessages","ngResource","ngRoute","ngSanitize","ngMaterial","ui.router","sasrio.angular-material-sidenav","material.svgAssetsCache","md.data.table"]);app.service("CoreService",CoreService),CoreService.$inject=["$rootScope","$http","$window"],app.config(["$mdThemingProvider","$locationProvider","$urlRouterProvider","$stateProvider","ssSideNavSectionsProvider","$mdIconProvider",function(a,b,c,d,e,f){a.theme("default").primaryPalette("light-blue",{"default":"700"}),f.iconSet("call","img/icons/sets/communication-icons.svg",24).iconSet("social","img/icons/sets/social-icons.svg",24),f.fontSet("md","material-icons"),c.otherwise(function(){return"/"}),d.state({name:"common","abstract":!0,templateUrl:"views/_common.html",controller:"CommonCtrl"}),d.state({name:"common.home",url:"/",templateUrl:"views/home.html",controller:"HomeCtrl"}),d.state({name:"common.faq",url:"/faq_main",templateUrl:"views/faq_main.html",controller:"FaqCtrl"}),d.state({name:"common.toggle1",url:"/toogle1","abstract":!0,template:"<ui-view/>"}),d.state({name:"common.toggle1.item1",url:"/item1",templateUrl:"views/default.html",controller:"FaqCtrl"}),d.state({name:"common.toggle1.item2",url:"/item2",templateUrl:"views/default.html",controller:"FaqCtrl"}),d.state({name:"common.toggle1.item3",url:"/item3",templateUrl:"views/default.html",controller:["$scope",function(a){a.model={title:"Hello Toogle 1 Item 3"}}]}),d.state({name:"common.link1",url:"/link1",templateUrl:"views/default.html",controller:["$scope",function(a){a.model={title:"Hello Link 1"}}]}),d.state({name:"common.link2.edit",url:"/edit",templateUrl:"views/default.html",controller:["$scope",function(a){a.model={title:"Hello Link 2"}}]}),d.state({name:"common.link3",url:"/link3",templateUrl:"views/default.html",controller:["$scope",function(a){a.model={title:"Hello Link 3"}}]}),d.state({name:"common.toggle2",url:"/toogle2","abstract":!0,template:"<ui-view/>"}),d.state({name:"common.toggle2.item1",url:"/item1",templateUrl:"views/default.html",controller:["$scope",function(a){a.model={title:"Hello Toogle 2 Item 1"}}]}),d.state({name:"common.toggle3",url:"/toogle3","abstract":!0,template:"<ui-view/>"}),d.state({name:"common.toggle3.item1",url:"/item1",templateUrl:"views/default.html",controller:["$scope",function(a){a.model={title:"Hello Toogle 3 Item 1"}}]}),d.state({name:"common.toggle3.item2",url:"/item2",templateUrl:"views/default.html",controller:["$scope",function(a){a.model={title:"Hello Toogle 3 Item 2"}}]}),e.initWithTheme(a),e.initWithSections([{id:"link_home",name:"Home ",state:"common.home",type:"link",icon:"fa fa-home"},{id:"link_faq",name:"FAQ Editor",state:"common.faq",type:"link"}])}]),app.run(["$rootScope","$http",function(a,b){a.apiServerUrl="/ccbot/",a.enableDebugLog=!0,a.apiCall={count:0},a.debuglog=function(b){a.enableDebugLog&&console.log(b)},a.clearMessage=function(){},a.setMessage=function(a,b){}}]),angular.module("demoApp").controller("CommonCtrl",["$scope","$mdSidenav","$timeout","$rootScope","$state","ssSideNav","ssSideNavSharedService",function(a,b,c,d,e,f,g){a.onClickMenu=function(){b("left").toggle()},a.menu=f,d.$on("SS_SIDENAV_CLICK_ITEM",function(){console.log("do whatever you want after click on item")})}]),angular.module("demoApp").controller("HomeCtrl",["$scope","$timeout","$state","ssSideNav",function(a,b,c,d){}]),angular.module("demoApp").controller("FaqCtrl",["$scope","$timeout","$state","ssSideNav","$mdDialog","$mdEditDialog","CoreService",function(a,b,c,d,e,f,g){function h(a,b,c){var d=this;c.id?g.callAPIGet("admin/faq/edit/msg/"+c.id,function(b){a.faq=b.data,a.nlpResponse=angular.fromJson(a.faq.metaMsg)}):(a.faq={faqKey:null,faqName:null,created:null,id:null,slotCnt:0,metaMsg:"Air",updated:null,weight:0,metaMsgCatId:c.metaMsgCatId},a.nlpResponse={}),a.jsonResult=function(){return JSON.stringify(a.nlpResponse)},a.hide=function(){b.hide()},a.cancel=function(){b.cancel()},a.submit=function(a,c){d.faqForm.$valid&&(a.metaMsg=JSON.stringify(c),console&&console.log(a),g.callAPIPost("admin/faq/save/msg",a,function(a){"SUCCESS"==a.status?(b.hide(),j.refreshCurrentNode()):alert("error occurred.")}))}}function i(a,b,c){g.callAPIGet("common/dropdown/nlpengine",function(b){a.nlpengineDropdown=b.data}),c.id?g.callAPIGet("admin/faq/edit/cat/"+c.id,function(b){a.category=b.data}):a.category={catKey:null,catName:null,created:null,id:null,nlpEngineId:null,parentMetaMsgCatId:c.parentMetaMsgCatId,weight:0},a.hide=function(){b.hide()},a.cancel=function(){b.cancel()},a.submit=function(a){console&&console.log(a),g.callAPIPost("admin/faq/save/cat",a,function(a){"SUCCESS"==a.status?(b.hide(),j.refreshCurrentNode()):alert("error occurred.")})}}var j=this;a.selected=[],a.limitOptions=[25,50,100],a.options={rowSelection:!0,multiSelect:!0,autoSelect:!1,decapitate:!1,largeEditDialog:!1,boundaryLinks:!1,limitSelect:!0,pageSelect:!0},a.query={order:"type",limit:25,page:1},this.searchMode=!1,this.searchtext="",this.searching=!1,this.goFaqHome=function(){g.callAPIGet("admin/faq/home",function(b){a.breadcrumb=[{name:"Root",id:""}],a.items={count:b.data.length,data:b.data}})},this.goFaqHome(),this.search=function(){j.searchtext&&(j.searching=!0,g.callAPIGet("admin/faq/search/"+j.searchtext,function(b){a.items={count:b.data.length,data:b.data},j.searching=!1}))},this.goback=function(){if(a.breadcrumb.length>1){a.breadcrumb.pop();var b=a.breadcrumb[a.breadcrumb.length-1];this.selectNode(!0,b)}},this.refreshCurrentNode=function(){var b=a.breadcrumb[a.breadcrumb.length-1];this.selectNode(!1,b)},this.selectNode=function(b,c){if(c&&c.id){if(b)for(var d=a.breadcrumb[a.breadcrumb.length-1];d.id!=c.id;)a.breadcrumb.pop(),d=a.breadcrumb[a.breadcrumb.length-1];g.callAPIGet("admin/faq/cat/"+c.id,function(d){b||a.breadcrumb.push(c),a.items={count:d.data.length,data:d.data}})}else this.goFaqHome()},this.drilldown=function(a){this.selectNode(!1,a)},this.addCatDialog=function(b){var c={id:null,type:"c",name:"",parentMetaMsgCatId:a.breadcrumb[a.breadcrumb.length-1].id};this.openFaqDialog(b,c)},this.addFaqDialog=function(b){var c={id:null,type:"f",name:"",metaMsgCatId:a.breadcrumb[a.breadcrumb.length-1].id};this.openFaqDialog(b,c)},this.openFaqDialog=function(b,c){"c"==c.type?e.show({controller:i,templateUrl:"views/cat_dialog.html",parent:angular.element(document.body),targetEvent:b,clickOutsideToClose:!0,locals:{selectedNode:c},fullscreen:a.customFullscreen}).then(function(b){a.status='You said the information was "'+b+'".'},function(){a.status="You cancelled the dialog."}):"f"==c.type&&e.show({controller:h,controllerAs:"faqDialogCtrl",templateUrl:"views/faq_dialog.html",parent:angular.element(document.body),targetEvent:b,clickOutsideToClose:!0,locals:{selectedNode:c},fullscreen:a.customFullscreen}).then(function(b){a.status='You said the information was "'+b+'".'},function(){a.status="You cancelled the dialog."})},a.logItem=function(a){console.log(a.name,"was selected")},a.logOrder=function(a){console.log("order: ",a)},a.logPagination=function(a,b){console.log("page: ",a),console.log("limit: ",b)},a.model={title:"FAQ Editor"};var k;this.openMenu=function(a,b){k=b,a(b)},h.$inject=["$scope","$mdDialog","selectedNode"],i.$inject=["$scope","$mdDialog","selectedNode"]}]),angular.module("demoApp").run(["$templateCache",function(a){a.put("views/_common.html",'<md-sidenav class="md-sidenav-left md-whiteframe-z2" md-component-id="left" md-is-locked-open="$mdMedia(\'gt-sm\')"> <header class="nav-header" ss-style-color="{\'background-color\': \'primary.default\'}"> <h1 class="md-heading">Demo</h1> </header> <md-content flex role="navigation" ss-style-color="{\'background-color\': \'primary.default\'}"> <ss-sidenav flex menu="menu"></ss-sidenav> </md-content> </md-sidenav> <div layout="column" flex role="main"> <div ui-view layout="column" flex></div> </div>'),a.put("views/cat_dialog.html",'<md-dialog aria-label="Edit Category" flex="80"> <form name="catForm" ng-cloak> <md-toolbar> <div class="md-toolbar-tools"> <h2>Edit Category</h2> <span flex></span> <md-button class="md-icon-button" ng-click="cancel()"> <md-icon md-svg-src="img/icons/ic_close_24px.svg" aria-label="Close dialog"></md-icon> </md-button> </div> </md-toolbar> <md-dialog-content> <div class="md-dialog-content"> <md-content layout-padding> <md-input-container class="md-block"> <label>Category Name</label> <input md-maxlength="128" required md-no-asterisk name="catName" ng-model="category.catName"> <div ng-messages="catForm.catName.$error"> <div ng-message="required">This is required.</div> <div ng-message="md-maxlength">The description must be less than 128 characters long.</div> </div> </md-input-container> <md-input-container class="md-block"> <label>NLP Engine</label> <md-select name="nlpengine" ng-model="category.nlpEngineId" required> <md-option><em>Choose...</em></md-option> <md-option ng-repeat="nlpEngineOp in nlpengineDropdown" ng-value="nlpEngineOp.id">{{nlpEngineOp.name}}</md-option> </md-select> <div ng-messages="catForm.nlpEngineId.$error"> <div ng-message="required">This is required.</div> </div> </md-input-container> <!--\r\n      <div layout="row">\r\n        <md-input-container flex="50">\r\n          <label>Category Key</label>\r\n          <input required name="name" ng-model="project.clientName">\r\n          <div ng-messages="catForm.clientName.$error">\r\n            <div ng-message="required">This is required.</div>\r\n          </div>\r\n        </md-input-container>\r\n   \r\n        <md-input-container flex="50">\r\n          <label>Project Type</label>\r\n          <md-select name="type" ng-model="project.type" required>\r\n            <md-option value="app">Application</md-option>\r\n            <md-option value="web">Website</md-option>\r\n          </md-select>\r\n        </md-input-container>\r\n        \r\n      </div>\r\n      --> <md-input-container class="md-block"> <label>Catgory Key</label> <input required name="catKey" ng-model="category.catKey"> <div ng-messages="catForm.catKey.$error"> <div ng-message="required">This is required.</div> <div ng-message="md-maxlength">The description must be less than 64 characters long.</div> </div> </md-input-container> <md-input-container class="md-block"> <label>Weight</label> <input required type="number" step="any" name="weight" ng-model="category.weight" min="0" max="100"> <div ng-messages="catForm.weight.$error"> <div ng-message="required">This is required.</div> </div> </md-input-container> <!--\r\n      <div>\r\n        <md-button class="md-raised"  type="submit">Submit</md-button>\r\n      </div>\r\n     \r\n      <p style="font-size:.8em; width: 100%; text-align: center;">\r\n        Make sure to include <a href="https://docs.angularjs.org/api/ngMessages" target="_blank">ngMessages</a> module when using ng-message markup.\r\n      </p>\r\n      --> </md-content> </div> </md-dialog-content> <md-dialog-actions layout="row"> <md-button ng-click="submit(category)"> Submit </md-button> <md-button ng-click="cancel()"> Cancel </md-button> </md-dialog-actions> </form> </md-dialog>'),a.put("views/default.html",'<md-toolbar> <div class="md-toolbar-tools"> <md-button class="md-icon-button" aria-label="Menu Button" hide-gt-md ng-click="onClickMenu();"> <md-icon md-svg-icon="images/icons/menu.f1d75e5f.svg" aria-label="Menu Icon"> </md-icon> </md-button> <h2>{{model.title}}</h2> <span flex></span> </div> </md-toolbar> <div class="md-menu-demo menudemoBasicUsage" ng-controller="FaqCtrl as ctrl"> <div class="menu-demo-container" layout-align="center center" layout="column"> <h2 class="md-title">Simple dropdown menu</h2> <p>Applying the <code>md-menu-origin</code> and <code>md-menu-align-target</code> attributes ensure that the menu elements align. Note: If you select the Redial menu option, then a modal dialog will zoom out of the phone icon button.</p> <md-menu> <md-button aria-label="Open phone interactions menu" class="md-icon-button" ng-click="ctrl.openMenu($mdOpenMenu, $event)"> <md-icon md-menu-origin="" md-svg-icon="call:phone"></md-icon> Action </md-button> <md-menu-content width="4"> <md-menu-item> <md-button ng-click="ctrl.redial($event)"> <md-icon md-svg-icon="call:dialpad" md-menu-align-target=""></md-icon> Redial </md-button> </md-menu-item> <md-menu-item> <md-button disabled ng-click="ctrl.checkVoicemail()"> <md-icon md-svg-icon="call:voicemail"></md-icon> Check voicemail </md-button> </md-menu-item> <md-menu-divider></md-menu-divider> <md-menu-item> <md-button ng-click="ctrl.toggleNotifications()"> <md-icon md-svg-icon="social:notifications-{{ctrl.notificationsEnabled ? \'off\' : \'on\'}}"></md-icon> {{ctrl.notificationsEnabled ? \'Disable\' : \'Enable\' }} notifications </md-button> </md-menu-item> </md-menu-content> </md-menu> </div> </div> <!--\r\nCopyright 2016 Google Inc. All Rights Reserved. \r\nUse of this source code is governed by an MIT-style license that can be foundin the LICENSE file at http://material.angularjs.org/HEAD/license.\r\n-->'),a.put("views/faq_dialog.html",'<md-dialog aria-label="Edit FAQ" flex-xs="90" flex-gt-xs="60"> <form name="faqDialogCtrl.faqForm"> <md-toolbar> <div class="md-toolbar-tools"> <h2>Edit FAQ</h2> <span flex></span> <md-button class="md-icon-button" ng-click="cancel()"> <md-icon md-svg-src="img/icons/ic_close_24px.svg" aria-label="Close dialog"></md-icon> </md-button> </div> </md-toolbar> <md-dialog-content style="max-width:800px;max-height:810px"> <md-tabs md-dynamic-height md-border-bottom> <md-tab label="Question"> <md-content class="md-padding"> <md-input-container class="md-block"> <label>FAQ Key</label> <input required name="faqKey" ng-model="faq.faqKey"> <div ng-messages="faqDialogCtrl.faqForm.faqKey.$error"> <div ng-message="required">This is required.</div> <div ng-message="md-maxlength">The description must be less than 64 characters long.</div> </div> </md-input-container> <md-input-container class="md-block"> <label>Question</label> <textarea required rows="2" md-maxlength="128" required md-no-asterisk name="faqName" ng-model="faq.faqName"></textarea> <div ng-messages="faqDialogCtrl.faqForm.faqName.$error"> <div ng-message="required">This is required.</div> <div ng-message="md-maxlength">The description must be less than 128 characters long.</div> </div> </md-input-container> </md-content> </md-tab> <md-tab label="Answer"> <md-content class="md-padding"> <div layout="column" class=""> <div layout="row">{{jsonResult()}}</div> <div layout="row"> <label flex="20">Operator (op):</label> <select flex ng-model="nlpResponse.op"> <option value="">-- Select an Op --</option> <option value="goto">Goto</option> <option value="gosub">Gosub</option> <option value="rtn">Return</option> <option value="disp">Dispatch</option> <option value="end">End</option> </select> </div> <div layout="row"> <label flex="20">Operand (opd):</label> <div flex ng-if="nlpResponse.operator != \'goto\' && nlpResponse.operator!=\'gosub\'">N/A</div> <textarea ng-if="nlpResponse.operator == \'goto\' || nlpResponse.operator==\'gosub\'" flex name="" rows="5" ng-model="nlpResponse.opd"></textarea> </div> <div layout="row"> <label flex="20">Answer:</label> <textarea flex rows="5" ng-model="nlpResponse.answer"></textarea> </div> <div layout="row"> <label flex="20">Javascript Function (fn):</label> <textarea flex rows="5" ng-model="nlpResponse.fn"></textarea> </div> </div> </md-content> </md-tab> </md-tabs> </md-dialog-content> <md-dialog-actions layout="row"> <md-button ng-disabled="!faqDialogCtrl.faqForm.$valid" ng-click="submit(faq,nlpResponse)"> Submit </md-button> <md-button ng-click="cancel()"> Cancel </md-button> </md-dialog-actions> </form> </md-dialog>'),a.put("views/faq_main.html",'<md-toolbar> <div class="md-toolbar-tools"> <md-button class="md-icon-button" aria-label="Menu Button" hide-gt-md ng-click="onClickMenu();"> <md-icon md-svg-icon="images/icons/menu.f1d75e5f.svg" aria-label="Menu Icon"> </md-icon> </md-button> <h2>FAQ Editor</h2> <span flex></span> </div> </md-toolbar> <md-content flex layout="column" ng-controller="FaqCtrl as ctrl"> <md-card> <md-toolbar class="md-table-toolbar md-default" ng-hide="!ctrl.searchMode"> <div layout="row" layout-align="center start" class="md-toolbar-tools"> <md-input-container md-no-float style="min-width:80%"> <md-icon>search</md-icon> <input placeholder="search" ng-model="ctrl.searchtext" ng-change="ctrl.search()"> <md-icon md-font-icon="fa fa-send" ng-click="ctrl.search()"></md-icon> </md-input-container> <div flex></div> <md-button class="md-icon-button" ng-click="ctrl.searchMode = false"> <md-icon>close</md-icon> </md-button> </div> <md-progress-linear md-mode="indeterminate" ng-if="ctrl.searching"></md-progress-linear> </md-toolbar> <md-toolbar hide-gt-xs ng-hide="ctrl.searchMode"> <section layout="row" layout-sm="column" layout-align="center center" layout-wrap> <md-button class="md-fab md-mini md-primary" ng-click="ctrl.goback()" aria-label="go back"> <md-icon md-font-icon="fa fa-level-up"></md-icon> </md-button> <md-button class="md-fab md-mini md-primary" aria-label="Add Category" ng-click="ctrl.addCatDialog($event)"> <md-icon md-font-set="md" class="md-fab" ng-style="{  \'font-size\':  \'24px\' }">create_new_folder</md-icon> </md-button> <md-button class="md-fab md-mini md-primary" aria-label="Add FAQ" ng-click="ctrl.addFaqDialog($event)"> <md-icon md-font-icon="fa fa-plus-square"></md-icon> </md-button> <md-button class="md-fab md-mini md-primary" ng-disabled="true" aria-label="cut"> <md-icon md-font-icon="fa fa-copy"></md-icon> </md-button> <md-button class="md-fab md-mini md-primary" aria-label="cut"> <md-icon md-font-icon="fa fa-cut"></md-icon> </md-button> <md-button class="md-fab md-mini md-primary" aria-label="Paste"> <md-icon md-font-icon="fa fa-paste"></md-icon> </md-button> <md-button class="md-fab md-mini md-primary" aria-label="Paste"> <md-icon md-font-icon="fa fa-remove"></md-icon> </md-button> <md-button class="md-fab md-mini md-primary" aria-label="Paste"> <md-icon md-font-icon="fa fa-upload"></md-icon> </md-button> <md-button class="md-fab md-mini md-primary" aria-label="Paste"> <md-icon md-font-icon="fa fa-download"></md-icon> </md-button> <md-button class="md-fab md-mini md-primary" ng-click="ctrl.searchMode = true ; ctrl.searchtext = \'\'" aria-label="Paste"> <md-icon md-font-icon="fa fa-search"></md-icon> </md-button> </section> </md-toolbar> <md-toolbar hide-xs ng-hide="ctrl.searchMode"> <section layout="row" layout-align="center center" style="max-height:80px"> <md-button aria-label="Go Back" ng-click="ctrl.goback()"> Go Back </md-button> <md-button class="md-raised" aria-label="Add Category" ng-click="ctrl.addCatDialog($event)"> Add Category </md-button> <md-button class="md-raised" aria-label="Add Category" ng-click="ctrl.addFaqDialog($event)"> Add FAQ </md-button> <div class="menu-demo-container" flex layout-align="center center" layout="column"> <md-menu> <md-button aria-label="Open phone interactions menu" class="" ng-click="ctrl.openMenu($mdOpenMenu, $event)"> <md-icon md-menu-origin="" md-svg-icon="call:dialpad"></md-icon> Edit </md-button> <md-menu-content> <md-menu-item> <md-button ng-click=""> <md-icon md-font-icon="fa fa-cut"></md-icon> Cut </md-button> </md-menu-item> <md-menu-item> <md-button disabled ng-click="ctrl.checkVoicemail()"> <md-icon md-font-icon="fa fa-copy"></md-icon> Copy </md-button> </md-menu-item> <md-menu-item class=""> <md-button disabled ng-click=""> <md-icon md-font-icon="fa fa-paste"></md-icon> Paste </md-button> </md-menu-item> <md-menu-divider></md-menu-divider> <md-menu-item> <md-button ng-click="ctrl.toggleNotifications()"> <md-icon md-font-icon="fa fa-remove"></md-icon> Remove </md-button> </md-menu-item> </md-menu-content> </md-menu> </div> <md-button class="md-raised md-small md-warn" ng-click="ctrl.searchMode = true;ctrl.searchtext = \'\'" aria-label="Search"><md-icon md-font-icon="fa fa-search"></md-icon> Search </md-button> <md-button class="md-raised md-small md-warn" aria-label="Import"><md-icon md-font-icon="fa fa-upload"></md-icon> Import </md-button> <md-button class="md-raised md-small md-warn" aria-label="Export"><md-icon md-font-icon="fa fa-download"></md-icon> Export </md-button> </section> </md-toolbar> <md-content flex layout-padding> <ol class="breadcrumb"> <li ng-repeat="bc in breadcrumb"> <a ng-if="bc.id != null" class="md-body-1" href="" ng-click="ctrl.selectNode(true,bc)">{{bc.name}}</a> <div class="md-body-1" ng-if="bc.id == null">{{bc.name}}</div> </li> </ol> <md-table-container> <table md-table md-row-select="options.rowSelection" multiple ng-model="selected" md-progress="promise"> <thead ng-if="!options.decapitate" md-head md-order="query.order" md-on-reorder="logOrder"> <tr md-row> <th md-column md-order-by="type"><span>Type</span></th> <th md-column md-order-by="name"><span>Name</span></th> <th md-column md-date md-order-by="updated" md-desc><span>Date Modified</span></th> </tr> </thead> <tbody md-body> <tr md-row md-select="row" md-on-select="logItem" md-auto-select="options.autoSelect" ng-repeat="row in items.data | filter: filter.search | orderBy: query.order | limitTo: query.limit : (query.page -1) * query.limit"> <td md-cell> <!-- <md-icon\r\n                md-svg-icon="images/icons/ic_insert_drive_file.4f67b2e4.svg"\r\n                aria-label="Menu Icon">\r\n                   <span  class="glyphicon glyphicon-{{row.type == \'c\' ? \'folder-open\' : \'file\'}}" style=\'color:rgb(2,136,209);\'></span>\r\n                   --> <i ng-if="row.type == \'f\'" class="material-icons" style="color:rgb(2,136,209)">insert_drive_file</i> <i ng-if="row.type == \'c\'" class="material-icons" style="color:rgb(2,136,209)">folder_open</i> </td> <td md-cell><a href class="cc-link" ng-if="row.type == \'c\'" ng-click="ctrl.drilldown(row)">{{row.name}}</a> <div ng-if="row.type ==\'f\'">{{row.name}}</div> </td> <td md-cell>{{row.updated}}</td> <td md-cell> <a href="" ng-click="ctrl.openFaqDialog($event, row)"> <span class="glyphicon glyphicon-edit"></span> Edit </a> </td> </tr> </tbody> </table> </md-table-container> <md-table-pagination md-limit="query.limit" md-limit-options="limitOptions" md-page="query.page" md-total="{{items.count}}" md-page-select="options.pageSelect" md-boundary-links="options.boundaryLinks" md-on-paginate="logPagination"></md-table-pagination> </md-content> </md-card> </md-content>'),a.put("views/home.html",'<md-toolbar> <div class="md-toolbar-tools"> <md-button class="md-icon-button" aria-label="Menu Button" hide-gt-md ng-click="onClickMenu();"> <md-icon md-svg-icon="images/icons/menu.f1d75e5f.svg" aria-label="Menu Icon"> </md-icon> </md-button> <h2>Home</h2> <span flex></span> </div> </md-toolbar> ')}]);