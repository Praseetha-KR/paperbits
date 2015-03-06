'use strict';

//Todos service used for communicating with the todos REST endpoints
angular.module('todos').factory('Todos', ['$resource',
	function($resource) {
		return $resource('todos/:todoId', {
			todoId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);