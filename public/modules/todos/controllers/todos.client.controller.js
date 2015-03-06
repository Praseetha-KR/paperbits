'use strict';

angular.module('todos').controller('TodosController', ['$scope', '$stateParams', '$location', 'Authentication', 'Todos',
	function($scope, $stateParams, $location, Authentication, Todos) {
		$scope.authentication = Authentication;

		$scope.create = function() {
			var todo = new Todos({
				task: this.task,
				content: this.content,
				priority: this.priority,
				done: this.done
			});
			todo.$save(function(response) {
				// $location.path('todos/' + response._id);
				$location.path('todos');

				$scope.task = '';
				$scope.content = '';
				$scope.priority = '';
				$scope.done = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.remove = function(todo) {
			if (todo) {
				todo.$remove();

				for (var i in $scope.todos) {
					if ($scope.todos[i] === todo) {
						$scope.todos.splice(i, 1);
					}
				}
			} else {
				$scope.todo.$remove(function() {
					$location.path('todos');
				});
			}
		};

		$scope.update = function() {
			var todo = $scope.todo;

			todo.$update(function(todo) {
				$location.path('todos');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.finishTask = function(todo) {
			if(todo.done) {
				todo.done = false;
			} else {
				todo.done = true;
			}
			
			todo.$update(function() {
				$location.path('todos');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.todos = Todos.query();
			$scope.predicate = '-created';
		};

		$scope.findOne = function() {
			$scope.todo = Todos.get({
				todoId: $stateParams.todoId
			});
		};
	}
]);