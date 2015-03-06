'use strict';

// Images controller
angular.module('images').controller('ImagesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Images', 'embedFactory',
	function($scope, $stateParams, $location, Authentication, Images, embedFactory) {
		$scope.authentication = Authentication;
		
		// Create new Image
		$scope.create = function() {
			var image = new Images({
				url: this.url,
				tags: this.tags
			});

			// Redirect after save
			image.$save(function(response) {
				$location.path('images/' + response._id);

				// Clear form fields
				$scope.url = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Image
		$scope.remove = function(image) {
			if (image) {
				image.$remove();

				for (var i in $scope.images) {
					if ($scope.images[i] === image) {
						$scope.images.splice(i, 1);
					}
				}
			} else {
				$scope.image.$remove(function() {
					$location.path('images');
				});
			}
		};

		// Update existing Image
		$scope.update = function() {
			var image = $scope.image;
			image.$update(function() {
				$location.path('images/' + image._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

		};

		// Find a list of Images
		$scope.find = function() {
			$scope.images = Images.query();
		};

		// Find existing Image
		$scope.findOne = function() {
			$scope.image = Images.get({
				imageId: $stateParams.imageId
			});
		};
	}
]);