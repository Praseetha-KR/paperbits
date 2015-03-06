'use strict';

(function() {
	// Colors Controller Spec
	describe('ColorsController', function() {
		// Initialize global variables
		var ColorsController,
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

			// Initialize the Colors controller.
			ColorsController = $controller('ColorsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one color object fetched from XHR', inject(function(Colors) {
			// Create sample color using the Colors service
			var sampleColor = new Colors({
				color_value: '#FFFFFF'
			});

			// Create a sample colors array that includes the new color
			var sampleColors = [sampleColor];

			// Set GET response
			$httpBackend.expectGET('colors').respond(sampleColors);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.colors).toEqualData(sampleColors);
		}));

		it('$scope.findOne() should create an array with one color object fetched from XHR using a colorId URL parameter', inject(function(Colors) {
			// Define a sample color object
			var sampleColor = new Colors({
				color_value: '#FFFFFF'
			});

			// Set the URL parameter
			$stateParams.colorId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/colors\/([0-9a-fA-F]{24})$/).respond(sampleColor);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.color).toEqualData(sampleColor);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Colors) {
			// Create a sample color object
			var sampleColorPostData = new Colors({
				color_value: '#FFFFFF'
			});

			// Create a sample color response
			var sampleColorResponse = new Colors({
				_id: '525cf20451979dea2c000001',
				color_value: '#FFFFFF'
			});

			// Fixture mock form input values
			scope.color_value = '#FFFFFF';

			// Set POST response
			$httpBackend.expectPOST('colors', sampleColorPostData).respond(sampleColorResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.color_value).toEqual('#FFFFFF');

			// Test URL redirection after the color was created
			expect($location.path()).toBe('/colors/' + sampleColorResponse._id);
		}));

		it('$scope.update() should update a valid color', inject(function(Colors) {
			// Define a sample color put data
			var sampleColorPutData = new Colors({
				_id: '525cf20451979dea2c000001',
				color_value: '#FFFFFF'
			});

			// Mock color in scope
			scope.color = sampleColorPutData;

			// Set PUT response
			$httpBackend.expectPUT(/colors\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/colors/' + sampleColorPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid colorId and remove the color from the scope', inject(function(Colors) {
			// Create new color object
			var sampleColor = new Colors({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new colors array and include the color
			scope.colors = [sampleColor];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/colors\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleColor);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.colors.length).toBe(0);
		}));
	});
}());