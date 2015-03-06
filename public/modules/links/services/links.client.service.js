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
])
.factory('embedFactory', ['$resource', function($resource) {
    return $resource(
        'http://api.embed.ly/1/oembed?url=:url',
        { url: '@url' },

        { 'query': { 'method': 'GET', isArray: false } }
    );
}]);