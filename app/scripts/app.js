'use strict';

/**
 * @ngdoc overview
 * @name demoApp
 * @description
 * # demoApp
 *
 * Main module of the application.
 */
var app = angular
    .module('demoApp', [
        'ngAnimate',
        'ngAria',
        'ngCookies',
        'ngMessages',
        'ngResource',
        'ngRoute',
        'ngSanitize',

        'ngMaterial',
        'ui.router',
        'sasrio.angular-material-sidenav',
        'material.svgAssetsCache',
		'md.data.table'
		
    ]);

app.service("CoreService", CoreService);

function CoreService($rootScope, $http, $window) {
    
    this.supportedLanguages = ['en', 'fr'];
    this.apiServerURL = $rootScope.apiServerUrl;
    this.callAPIGet = function(ep_uri, onSussessFunc, onErrorFunc) {
        $rootScope.apiCall.count = $rootScope.apiCall.count + 1;
        $rootScope.clearMessage();
        //var userToken = $rootScope.retrieveUserToken();
        var apiUrl = this.apiServerURL + ep_uri;

        $http.get(apiUrl, {
            //headers: {'CC_Token': userToken}
        })
            .success(function(result, status, headers, config) {
                $rootScope.apiCall.count = $rootScope.apiCall.count - 1;
                if (result.status == 'SUCCESS') {
                    if (onSussessFunc != null) {
                        onSussessFunc(result);
                    } else {
                        $rootScope.debuglog('CoreService.callAPIGet: result is not set due to onSussessFunc is null.');
                    }
                } else {
                    $rootScope.setMessage(true, "API call unsuccessful:"+result.status+", " + result.message);
                    if (onErrorFunc != null) {
                        onErrorFunc(result, status);
                    } else {
                        $rootScope.debuglog('CoreService.callAPIGet: unsuccessful result is not processed due to onErrorFunc is null.');
                    }
                }
            })
            .error(function(result, status, headers, config) {
                $rootScope.apiCall.count = $rootScope.apiCall.count - 1;
                $rootScope.setMessage(true, "API Error, status code: "+status);
                $rootScope.debuglog('Get error, status code:' + status + ', ' +result);
                if (status == '-1') {
                    $rootScope.setMessage(true, "Unable to connect to API server " + $rootScope.apiServerUrl);
                }
                if (status == '401') {
                    // need login
                    $window.location.href = $rootScope._loginUrl;
                } else if (status == '403') {
                    if (result.code) $rootScope.handleAPIError(result.code);
                    else {
                        $rootScope.setMessage(true, "You do not have permission to perform the requested function");
                    }
                }
                if (onErrorFunc != null) {
                    onErrorFunc(result, status);
                } 
            }); 
    }
    
    this.callAPIPost = function(ep_uri, param, onSussessFunc, onErrorFunc) {
        $rootScope.debuglog('CoreService.callAPIPost:' + ep_uri);
        $rootScope.apiCall.count = $rootScope.apiCall.count + 1;
        $rootScope.clearMessage();
        
        var userToken = $rootScope.retrieveUserToken();
        var apiUrl = this.apiServerURL + ep_uri;
        $rootScope.debuglog('CoreService.callAPIPost:' + apiUrl + ', token:'+userToken);

        var authConfig = {
            headers : {
                //   'CC_Token': userToken
            }
        }
        $http.post(this.apiServerURL + ep_uri, param, authConfig)
            .success(function(result, status, headers, config) {
                $rootScope.apiCall.count = $rootScope.apiCall.count - 1;
                if (result.status == 'SUCCESS') {
                    if (onSussessFunc) {
                        onSussessFunc(result);
                    } else {
                        $rootScope.debuglog('CoreService.callAPIPost: result is not set due to onSussessFunc is null.');
                    }
                } else {
                    $rootScope.setMessage(true, "API call unsuccessful:"+result.status+", " + result.message);
                    if (onErrorFunc) {
                        onErrorFunc(result, status);
                    } else {
                        $rootScope.debuglog('CoreService.callAPIPost: unsuccessful result is not processed due to onErrorFunc is null.');
                    }
                }   
            })
            .error(function(result, status, headers, config) {
                $rootScope.apiCall.count = $rootScope.apiCall.count - 1;
                $rootScope.debuglog('Post error, status code:' + status + ', ' +JSON.stringify(result));
                //$scope.setErrorMessage( result.status + ',' + result.message);
                if (status == '-1') {
                    $rootScope.setMessage(true, "Unable to connect to API server " + $rootScope.apiServerUrl);
                }
                if (status == '401') {
                    // need login
                    $window.location.href = $rootScope._loginUrl;
                }
                if (status == '403') {
                    // validation error
                    if (result.code) $rootScope.handleAPIError(result.code);
                    else {
                        $rootScope.setMessage(true, "You do not have permission to perform the requested function");
                    }
                } else if (status == '406' || status == '400') {
                    // validation error
                    if (result.code) $rootScope.handleAPIError(result.code);
                    else {
                        $rootScope.setMessage(true, "Validation Error:"+ result.message);
                    }
                } else if (status == '409') {
                    $rootScope.setMessage(true, "You are updating a stale copy of data, or aonther user has modified the data. Please reload this page.");
                } else {
                    $rootScope.setMessage(true, "API Error, status code: "+status);
                } 
                if (onErrorFunc) {
                    onErrorFunc(result, status);
                } else {
                    //CoreService.setMessage("Error in contacting API server, status: "+status);
                    $rootScope.debuglog('CoreService.callAPIPost: no user error hanlder specified.');
                }
            });     
    }

}

CoreService.$inject = ['$rootScope', '$http', '$window'];


app.config([
        '$mdThemingProvider',
        '$locationProvider',
        '$urlRouterProvider',
        '$stateProvider',
        'ssSideNavSectionsProvider',
        '$mdIconProvider',
        function (
            $mdThemingProvider,
            $locationProvider,
            $urlRouterProvider,
            $stateProvider,
            ssSideNavSectionsProvider,
            $mdIconProvider) {

            $mdThemingProvider
                .theme('default')
                .primaryPalette('light-blue', {
                    'default': '700'
                });

            $mdIconProvider
                  .iconSet("call", 'img/icons/sets/communication-icons.svg', 24)
                  .iconSet("social", 'img/icons/sets/social-icons.svg', 24);
            $mdIconProvider.fontSet('md', 'material-icons');
 
            $urlRouterProvider.otherwise(function () {
                return '/';
            });

            $stateProvider.state({
                name: 'common',
                abstract: true,
                templateUrl: 'views/_common.html',
                controller: 'CommonCtrl'
            });

            $stateProvider.state({
                name: 'common.home',
                url: '/',
                templateUrl: 'views/home.html',
                controller: 'HomeCtrl'
            });


            $stateProvider.state({
                name: 'common.faq',
                url: '/faq_main',
                templateUrl: 'views/faq_main.html',
                controller:  'FaqCtrl'
            });

            $stateProvider.state({
                name: 'common.toggle1',
                url: '/toogle1',
                abstract: true,
                template: '<ui-view/>'
            });

            $stateProvider.state({
                name: 'common.toggle1.item1',
                url: '/item1',
                templateUrl: 'views/default.html',
                controller:  'FaqCtrl'
            });

            $stateProvider.state({
                name: 'common.toggle1.item2',
                url: '/item2',
                templateUrl: 'views/default.html',
                controller: 'FaqCtrl'
            });

            $stateProvider.state({
                name: 'common.toggle1.item3',
                url: '/item3',
                templateUrl: 'views/default.html',
                controller: function ($scope) {
                    $scope.model = {
                        title: 'Hello Toogle 1 Item 3'
                    };
                }
            });

            $stateProvider.state({
                name: 'common.link1',
                url: '/link1',
                templateUrl: 'views/default.html',
                controller: function ($scope) {
                    $scope.model = {
                        title: 'Hello Link 1'
                    };
                }
            });


            $stateProvider.state({
                name: 'common.link2.edit',
                url: '/edit',
                templateUrl: 'views/default.html',
                controller: function ($scope) {
                    $scope.model = {
                        title: 'Hello Link 2'
                    };
                }
            });

            $stateProvider.state({
                name: 'common.link3',
                url: '/link3',
                templateUrl: 'views/default.html',
                controller: function ($scope) {
                    $scope.model = {
                        title: 'Hello Link 3'
                    };
                }
            });

            $stateProvider.state({
                name: 'common.toggle2',
                url: '/toogle2',
                abstract: true,
                template: '<ui-view/>'
            });

            $stateProvider.state({
                name: 'common.toggle2.item1',
                url: '/item1',
                templateUrl: 'views/default.html',
                controller: function ($scope) {
                    $scope.model = {
                        title: 'Hello Toogle 2 Item 1'
                    };
                }
            });

            $stateProvider.state({
                name: 'common.toggle3',
                url: '/toogle3',
                abstract: true,
                template: '<ui-view/>'
            });

            $stateProvider.state({
                name: 'common.toggle3.item1',
                url: '/item1',
                templateUrl: 'views/default.html',
                controller: function ($scope) {
                    $scope.model = {
                        title: 'Hello Toogle 3 Item 1'
                    };
                }
            });

            $stateProvider.state({
                name: 'common.toggle3.item2',
                url: '/item2',
                templateUrl: 'views/default.html',
                controller: function ($scope) {
                    $scope.model = {
                        title: 'Hello Toogle 3 Item 2'
                    };
                }
            });

            ssSideNavSectionsProvider.initWithTheme($mdThemingProvider);
            ssSideNavSectionsProvider.initWithSections([
                  {
                        id: 'link_home',
                        name: 'Home ',
                        state: 'common.home',
                        type: 'link',
                        icon: 'fa fa-home'
                    }, 

                    {
                id: 'link_faq',
                name: 'FAQ Editor',
                state: 'common.faq',
                type: 'link'
            } ,
                {
                id: 'toogle_1',
                name: 'Section Heading 1',
                type: 'heading',
                children: [
                    
                {
                    name: 'Toogle 1',
                    type: 'toggle',
                    pages: [{
                        id: 'toogle_1_link_1',
                        name: 'item 1',
                        state: 'common.toggle1.item1'
                    }, {
                        id: 'toogle_1_link_2',
                        name: 'item 2',
                        state: 'common.toggle1.item2',
                        hidden: true
                    }, {
                        id: 'toogle_1_link_3',
                        name: 'item 3',
                        state: 'common.toggle1.item3'
                    }]
                }]
            }, {
                id: 'link_1',
                name: 'Link 1 ',
                state: 'common.link1',
                type: 'link',
                icon: 'fa fa-check'
            }, {
                id: 'link_3',
                name: 'Link 3',
                state: 'common.link3',
                type: 'link',
                hidden: true
            },  {
                id: 'toogle_2',
                name: 'Section Heading 2',
                type: 'heading',
                children: [{
                    name: 'Toogle 2',
                    type: 'toggle',
                    pages: [{
                        id: 'toogle_2_link_1',
                        name: 'item 1',
                        state: 'common.toggle2.item1'
                    }]
                }]
            }]);
        }
    ]);



app.run(function($rootScope, $http) {
	//$rootScope._loginUrl = __env.userLoginUrl;
	//$rootScope._logoutUrl = __env.userLogoutUrl;
    $rootScope.apiServerUrl = 'http://localhost:8080/';
	$rootScope.enableDebugLog = true ; //__env.enableDebugLog;
	//$rootScope.buildVersionNumber = __env.buildVersionNumber;

	
	$rootScope.apiCall = {count : 0};

    $rootScope.debuglog = function(msg) {
		if ($rootScope.enableDebugLog) {
			console.log(msg);
		}
	};

	$rootScope.clearMessage = function() {
		 
	}
	$rootScope.setMessage = function(isErr, msgText) {
	 
	}
});