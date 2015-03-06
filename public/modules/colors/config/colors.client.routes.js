'use strict';

// Setting up route
angular.module('colors').config(['$stateProvider',
	function($stateProvider) {
		// Colors state routing
		$stateProvider.
		state('listColors', {
			url: '/colors',
			templateUrl: 'modules/colors/views/list-colors.client.view.html'
		}).
		state('createColor', {
			url: '/colors/create',
			templateUrl: 'modules/colors/views/create-color.client.view.html'
		}).
		state('viewColor', {
			url: '/colors/:colorId',
			templateUrl: 'modules/colors/views/view-color.client.view.html'
		}).
		state('editColor', {
			url: '/colors/:colorId/edit',
			templateUrl: 'modules/colors/views/edit-color.client.view.html'
		});
	}
]);