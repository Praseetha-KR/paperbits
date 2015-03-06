'use strict';

//Colors service used for communicating with the colors REST endpoints
angular.module('colors').factory('Colors', ['$resource',
	function($resource) {
		return $resource('colors/:colorId', {
			colorId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);