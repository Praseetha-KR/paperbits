'use strict';

// Setting up route
angular.module('links').config(['$stateProvider',
	function($stateProvider) {
		// Links state routing
		$stateProvider.
		state('listLinks', {
			url: '/links',
			templateUrl: 'modules/links/views/list-links.client.view.html'
		}).
		state('createLink', {
			url: '/links/create',
			templateUrl: 'modules/links/views/create-link.client.view.html'
		}).
		state('viewLink', {
			url: '/links/:linkId',
			templateUrl: 'modules/links/views/view-link.client.view.html'
		}).
		state('editLink', {
			url: '/links/:linkId/edit',
			templateUrl: 'modules/links/views/edit-link.client.view.html'
		});
	}
]);