'use strict';

//Links service used for communicating with the links REST endpoints
angular.module('links').factory('Links', ['$resource',
	function($resource) {
		return $resource('links/:linkId', {
			linkId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);