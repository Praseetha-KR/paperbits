'use strict';

// Setting up route
angular.module('images').config(['$stateProvider',
	function($stateProvider) {
		// Images state routing
		$stateProvider.
		state('listImages', {
			url: '/images',
			templateUrl: 'modules/images/views/list-images.client.view.html'
		}).
		state('createImage', {
			url: '/images/create',
			templateUrl: 'modules/images/views/create-image.client.view.html'
		}).
		state('viewImage', {
			url: '/images/:imageId',
			templateUrl: 'modules/images/views/view-image.client.view.html'
		}).
		state('editImage', {
			url: '/images/:imageId/edit',
			templateUrl: 'modules/images/views/edit-image.client.view.html'
		});
	}
]);