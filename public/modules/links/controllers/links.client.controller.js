'use strict';

// Links controller
angular.module('links').controller('LinksController', ['$scope', '$stateParams', '$location', 'Authentication', 'Links',
	function($scope, $stateParams, $location, Authentication, Links) {
		$scope.authentication = Authentication;

		// Create new Link
		$scope.create = function() {
			// Create new Link object
			var link = new Links({
				url: this.url
			});

			// Redirect after save
			link.$save(function(response) {
				$location.path('links/' + response._id);

				// Clear form fields
				$scope.url = '';
			}, function(errorResponse) {
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
			var link = $scope.link;

			link.$update(function() {
				$location.path('links/' + link._id);
			}, function(errorResponse) {
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