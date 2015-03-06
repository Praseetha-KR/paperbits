'use strict';

(function() {
	// Links Controller Spec
	describe('Links Controller Tests', function() {
		// Initialize global variables
		var LinksController,
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

			// Initialize the Links controller.
			LinksController = $controller('LinksController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one link object fetched from XHR', inject(function(Links) {
			// Create sample link using the Links service
			var sampleLink = new Links({
				url: 'A Link on Paperbits'
			});

			// Create a sample links array that includes the new link
			var sampleLinks = [sampleLink];

			// Set GET response
			$httpBackend.expectGET('links').respond(sampleLinks);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.links).toEqualData(sampleLinks);
		}));

		it('$scope.findOne() should create an array with one link object fetched from XHR using a linkId URL parameter', inject(function(Links) {
			// Define a sample link object
			var sampleLink = new Links({
				url: 'A Link on Paperbits'
			});

			// Set the URL parameter
			$stateParams.linkId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/links\/([0-9a-fA-F]{24})$/).respond(sampleLink);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.link).toEqualData(sampleLink);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Links) {
			// Create a sample link object
			var sampleLinkPostData = new Links({
				url: 'A Link on Paperbits'
			});

			// Create a sample link response
			var sampleLinkResponse = new Links({
				_id: '525cf20451979dea2c000001',
				url: 'A Link on Paperbits'
			});

			// Fixture mock form input values
			scope.url = 'A Link on Paperbits';

			// Set POST response
			$httpBackend.expectPOST('links', sampleLinkPostData).respond(sampleLinkResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.url).toEqual('');

			// Test URL redirection after the link was created
			expect($location.path()).toBe('/links/' + sampleLinkResponse._id);
		}));

		it('$scope.update() should update a valid link', inject(function(Links) {
			// Define a sample link put data
			var sampleLinkPutData = new Links({
				_id: '525cf20451979dea2c000001',
				url: 'A Link on Paperbits'
			});

			// Mock link in scope
			scope.link = sampleLinkPutData;

			// Set PUT response
			$httpBackend.expectPUT(/links\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/links/' + sampleLinkPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid linkId and remove the link from the scope', inject(function(Links) {
			// Create new link object
			var sampleLink = new Links({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new links array and include the link
			scope.links = [sampleLink];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/links\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleLink);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.links.length).toBe(0);
		}));
	});
}());