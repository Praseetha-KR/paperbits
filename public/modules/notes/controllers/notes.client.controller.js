'use strict';

// Notes controller
angular.module('notes').controller('NotesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Notes',
	function($scope, $stateParams, $location, Authentication, Notes) {
		$scope.authentication = Authentication;

		// Create new Note
		$scope.create = function() {
			// Create new Note object
			var note = new Notes({
				title: this.title,
				content: this.content,
				notebook: this.notebook
			});

			// Redirect after save
			note.$save(function(response) {
				$location.path('notes');

				// Clear form fields
				$scope.title = '';
				$scope.content = '';
				$scope.notebook = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Note
		$scope.remove = function(note) {
			if (note) {
				note.$remove();

				for (var i in $scope.notes) {
					if ($scope.notes[i] === note) {
						$scope.notes.splice(i, 1);
					}
				}
				$location.path('notes');
			} else {
				$scope.note.$remove(function() {
					$location.path('notes');
				});
			}
		};

		// Update existing Note
		$scope.update = function() {
			var note = $scope.note;

			note.$update(function() {
				$location.path('notes');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Notes
		$scope.find = function() {
			$scope.notes = Notes.query();
		};

		// Find existing Note
		$scope.findOne = function() {
			$scope.note = Notes.get({
				noteId: $stateParams.noteId
			});
		};
	}
])

.directive('elastic', [
    '$timeout',
    function($timeout) {
		return {
			restrict: 'A',
			link: function($scope, element) {
				var resize = function() {
					element[0].style.height = '' + element[0].scrollHeight + 'px';
					return element[0].style.height;
				};
				element.on('blur keyup change', resize);
				$timeout(resize, 0);
			}
		};
    }
]);