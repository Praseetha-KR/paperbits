'use strict';

(function() {
	// Todos Controller Spec
	describe('TodosController', function() {
		// Initialize global variables
		var TodosController,
			scope,
			$httpBackend,
			$stateParams,
			$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Todos controller.
			TodosController = $controller('TodosController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one todo object fetched from XHR', inject(function(Todos) {
			// Create sample todo using the Todos service
			var sampleTodo = new Todos({
				title: 'An Todo about MEAN',
				content: 'MEAN rocks!'
			});

			// Create a sample todos array that includes the new todo
			var sampleTodos = [sampleTodo];

			// Set GET response
			$httpBackend.expectGET('todos').respond(sampleTodos);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.todos).toEqualData(sampleTodos);
		}));

		it('$scope.findOne() should create an array with one todo object fetched from XHR using a todoId URL parameter', inject(function(Todos) {
			// Define a sample todo object
			var sampleTodo = new Todos({
				title: 'An Todo about MEAN',
				content: 'MEAN rocks!'
			});

			// Set the URL parameter
			$stateParams.todoId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/todos\/([0-9a-fA-F]{24})$/).respond(sampleTodo);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.todo).toEqualData(sampleTodo);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Todos) {
			// Create a sample todo object
			var sampleTodoPostData = new Todos({
				title: 'An Todo about MEAN',
				content: 'MEAN rocks!'
			});

			// Create a sample todo response
			var sampleTodoResponse = new Todos({
				_id: '525cf20451979dea2c000001',
				title: 'An Todo about MEAN',
				content: 'MEAN rocks!'
			});

			// Fixture mock form input values
			scope.title = 'An Todo about MEAN';
			scope.content = 'MEAN rocks!';

			// Set POST response
			$httpBackend.expectPOST('todos', sampleTodoPostData).respond(sampleTodoResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.title).toEqual('');
			expect(scope.content).toEqual('');

			// Test URL redirection after the todo was created
			expect($location.path()).toBe('/todos/' + sampleTodoResponse._id);
		}));

		it('$scope.update() should update a valid todo', inject(function(Todos) {
			// Define a sample todo put data
			var sampleTodoPutData = new Todos({
				_id: '525cf20451979dea2c000001',
				title: 'An Todo about MEAN',
				content: 'MEAN Rocks!'
			});

			// Mock todo in scope
			scope.todo = sampleTodoPutData;

			// Set PUT response
			$httpBackend.expectPUT(/todos\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/todos/' + sampleTodoPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid todoId and remove the todo from the scope', inject(function(Todos) {
			// Create new todo object
			var sampleTodo = new Todos({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new todos array and include the todo
			scope.todos = [sampleTodo];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/todos\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleTodo);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.todos.length).toBe(0);
		}));
	});
}());