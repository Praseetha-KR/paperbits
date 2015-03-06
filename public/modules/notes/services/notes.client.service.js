'use strict';

//Notes service used for communicating with the notes REST endpoints
angular.module('notes').factory('Notes', ['$resource',
	function($resource) {
		return $resource('notes/:noteId', {
			noteId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);