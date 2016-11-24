'use strict';

/**
 * @ngdoc function
 * @name demoApp.controller:IndexCtrl
 * @description
 * # IndexCtrl
 * Controller of the demoApp
 */
angular.module('demoApp')

    .controller('HomeCtrl', [
        '$scope',
        '$timeout',
        '$state',
        'ssSideNav',
        function (
            $scope,
            $timeout,
            $state,
            ssSideNav) {

			 $scope.rowCollection = [
       
     	   { id: "1", Type: "Cat", Name: "Cat 1", Modified: '2016/03/01'},
            { id: "2", Type: "Cat", Name: "Cat 2", Modified: '2016/01/01'}, 
            { id: "3", Type: "Cat", Name: "Cat 3", Modified: '2016/01/02'},
            { id: "4", Type: "FAQ", Name: "FAQ 1", Modified: '2016/01/01'},
            { id: "5", Type: "FAQ", Name: "FAQ 2", Modified: '2016/03/01'},
            { id: "6", Type: "FAQ", Name: "FAQ 3", Modified: '2016/01/01'},
            { id: "7", Type: 'FAQ', Name: "FAQ 4", Modified: '2016/04/01'}
            
          ];

		  
	   }
    ]);