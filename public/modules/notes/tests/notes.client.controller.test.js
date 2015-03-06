'use strict';

(function() {
	// Notes Controller Spec
	describe('Notes Controller Tests', function() {
		// Initialize global variables
		var NotesController,
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

			// Initialize the Notes controller.
			NotesController = $controller('NotesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one note object fetched from XHR', inject(function(Notes) {
			// Create sample note using the Notes service
			var sampleNote = new Notes({
				title: 'A Note about Paperbits',
				content: 'Paperbits rocks!',
				notebook: 'Paperbits in a notebook!'
			});

			// Create a sample notes array that includes the new note
			var sampleNotes = [sampleNote];

			// Set GET response
			$httpBackend.expectGET('notes').respond(sampleNotes);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.notes).toEqualData(sampleNotes);
		}));

		it('$scope.findOne() should create an array with one note object fetched from XHR using a noteId URL parameter', inject(function(Notes) {
			// Define a sample note object
			var sampleNote = new Notes({
				title: 'A Note about Paperbits',
				content: 'Paperbits rocks!',
				notebook: 'Paperbits in a notebook!'
			});

			// Set the URL parameter
			$stateParams.noteId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/notes\/([0-9a-fA-F]{24})$/).respond(sampleNote);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.note).toEqualData(sampleNote);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Notes) {
			// Create a sample note object
			var sampleNotePostData = new Notes({
				title: 'A Note about Paperbits',
				content: 'Paperbits rocks!',
				notebook: 'Paperbits in a notebook!'
			});

			// Create a sample note response
			var sampleNoteResponse = new Notes({
				_id: '525cf20451979dea2c000001',
				title: 'A Note about Paperbits',
				content: 'Paperbits rocks!',
				notebook: 'Paperbits in a notebook!'
			});

			// Fixture mock form input values
			scope.title = 'A Note about Paperbits';
			scope.content = 'Paperbits rocks!';
			scope.notebook = 'Paperbits in a notebook!';

			// Set POST response
			$httpBackend.expectPOST('notes', sampleNotePostData).respond(sampleNoteResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.title).toEqual('');
			expect(scope.content).toEqual('');
			expect(scope.notebook).toEqual('');

			// Test URL redirection after the note was created
			expect($location.path()).toBe('/notes/' + sampleNoteResponse._id);
		}));

		it('$scope.update() should update a valid note', inject(function(Notes) {
			// Define a sample note put data
			var sampleNotePutData = new Notes({
				_id: '525cf20451979dea2c000001',
				title: 'A Note about Paperbits',
				content: 'Paperbits Rocks!',
				notebook: 'Paperbits in a notebook!'
			});

			// Mock note in scope
			scope.note = sampleNotePutData;

			// Set PUT response
			$httpBackend.expectPUT(/notes\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/notes/' + sampleNotePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid noteId and remove the note from the scope', inject(function(Notes) {
			// Create new note object
			var sampleNote = new Notes({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new notes array and include the note
			scope.notes = [sampleNote];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/notes\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleNote);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.notes.length).toBe(0);
		}));
	});
}());