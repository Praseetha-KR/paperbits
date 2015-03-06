'use strict';

// Links controller
angular.module('links').controller('LinksController', ['$scope', '$stateParams', '$location', 'Authentication', 'Links', 'embedFactory',
	function($scope, $stateParams, $location, Authentication, Links, embedFactory) {
		$scope.authentication = Authentication;
		
		// Create new Link
		$scope.create = function() {
			var thisurl = this.url;
			embedFactory.query({url:this.url},
				function success(data) {
					// Create new Link object
					var link = new Links({
						url: thisurl,
						title: data.title,
						description: data.description,
						thumbnail_url: data.thumbnail_url,
						provider_name: data.provider_name,
						provider_url: data.provider_url
					});

					// Redirect after save
					link.$save(function(response) {
						$location.path('links/' + response._id);

						// Clear form fields
						$scope.url = '';
					}, function(errorResponse) {
						$scope.error = errorResponse.data.message;
					});
				}, function err(errorResponse) {
					$scope.error = errorResponse.data.message;
				});
		};

		// Remove existing Link
		$scope.remove = function(link) {
			if (link) {
				link.$remove();

				for (var i in $scope.links) {
					if ($scope.links[i] === link) {
						$scope.links.splice(i, 1);
					}
				}
			} else {
				$scope.link.$remove(function() {
					$location.path('links');
				});
			}
		};

		// Update existing Link
		$scope.update = function() {
			embedFactory.query({url:$scope.link.url},
				function success(data) {
					var link = $scope.link;
					link.title = data.title;
					link.description = data.description;
					link.thumbnail_url = data.thumbnail_url;
					link.provider_name = data.provider_name;
					link.provider_url = data.provider_url;

					link.$update(function() {
						$location.path('links/' + link._id);
					}, function(errorResponse) {
						$scope.error = errorResponse.data.message;
					});
				}, function err(errorResponse) {
					$scope.error = errorResponse.data.message;
				});

		};

		// Find a list of Links
		$scope.find = function() {
			$scope.links = Links.query();
		};

		// Find existing Link
		$scope.findOne = function() {
			$scope.link = Links.get({
				linkId: $stateParams.linkId
			});
		};
	}
]);