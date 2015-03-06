'use strict';

(function() {
	// Images Controller Spec
	describe('Images Controller Tests', function() {
		// Initialize global variables
		var ImagesController,
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

			// Initialize the Images controller.
			ImagesController = $controller('ImagesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one image object fetched from XHR', inject(function(Images) {
			// Create sample image using the Images service
			var sampleImage = new Images({
				url: 'A Image on Paperbits'
			});

			// Create a sample images array that includes the new image
			var sampleImages = [sampleImage];

			// Set GET response
			$httpBackend.expectGET('images').respond(sampleImages);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.images).toEqualData(sampleImages);
		}));

		it('$scope.findOne() should create an array with one image object fetched from XHR using a imageId URL parameter', inject(function(Images) {
			// Define a sample image object
			var sampleImage = new Images({
				url: 'A Image on Paperbits'
			});

			// Set the URL parameter
			$stateParams.imageId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/images\/([0-9a-fA-F]{24})$/).respond(sampleImage);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.image).toEqualData(sampleImage);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Images) {
			// Create a sample image object
			var sampleImagePostData = new Images({
				url: 'A Image on Paperbits'
			});

			// Create a sample image response
			var sampleImageResponse = new Images({
				_id: '525cf20451979dea2c000001',
				url: 'A Image on Paperbits'
			});

			// Fixture mock form input values
			scope.url = 'A Image on Paperbits';

			// Set POST response
			$httpBackend.expectPOST('images', sampleImagePostData).respond(sampleImageResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.url).toEqual('');

			// Test URL redirection after the image was created
			expect($location.path()).toBe('/images/' + sampleImageResponse._id);
		}));

		it('$scope.update() should update a valid image', inject(function(Images) {
			// Define a sample image put data
			var sampleImagePutData = new Images({
				_id: '525cf20451979dea2c000001',
				url: 'A Image on Paperbits'
			});

			// Mock image in scope
			scope.image = sampleImagePutData;

			// Set PUT response
			$httpBackend.expectPUT(/images\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/images/' + sampleImagePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid imageId and remove the image from the scope', inject(function(Images) {
			// Create new image object
			var sampleImage = new Images({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new images array and include the image
			scope.images = [sampleImage];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/images\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleImage);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.images.length).toBe(0);
		}));
	});
}());