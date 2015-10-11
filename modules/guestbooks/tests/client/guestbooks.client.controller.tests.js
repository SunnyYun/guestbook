'use strict';

(function() {
	// guestbooks Controller Spec
	describe('guestbooksController', function() {
		// Initialize global variables
		var guestbooksController,
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

			// Initialize the guestbooks controller.
			guestbooksController = $controller('guestbooksController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one guestbook object fetched from XHR', inject(function(guestbooks) {
			// Create sample guestbook using the guestbooks service
			var sampleguestbook = new guestbooks({
				title: 'An guestbook about MEAN',
				content: 'MEAN rocks!'
			});

			// Create a sample guestbooks array that includes the new guestbook
			var sampleguestbooks = [sampleguestbook];

			// Set GET response
			$httpBackend.expectGET('api/guestbooks').respond(sampleguestbooks);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.guestbooks).toEqualData(sampleguestbooks);
		}));

		it('$scope.findOne() should create an array with one guestbook object fetched from XHR using a guestbookId URL parameter', inject(function(guestbooks) {
			// Define a sample guestbook object
			var sampleguestbook = new guestbooks({
				title: 'An guestbook about MEAN',
				content: 'MEAN rocks!'
			});

			// Set the URL parameter
			$stateParams.guestbookId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/api\/guestbooks\/([0-9a-fA-F]{24})$/).respond(sampleguestbook);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.guestbook).toEqualData(sampleguestbook);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(guestbooks) {
			// Create a sample guestbook object
			var sampleguestbookPostData = new guestbooks({
				title: 'An guestbook about MEAN',
				content: 'MEAN rocks!'
			});

			// Create a sample guestbook response
			var sampleguestbookResponse = new guestbooks({
				_id: '525cf20451979dea2c000001',
				title: 'An guestbook about MEAN',
				content: 'MEAN rocks!'
			});

			// Fixture mock form input values
			scope.title = 'An guestbook about MEAN';
			scope.content = 'MEAN rocks!';

			// Set POST response
			$httpBackend.expectPOST('api/guestbooks', sampleguestbookPostData).respond(sampleguestbookResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.title).toEqual('');
			expect(scope.content).toEqual('');

			// Test URL redirection after the guestbook was created
			expect($location.path()).toBe('/guestbooks/' + sampleguestbookResponse._id);
		}));

		it('$scope.update() should update a valid guestbook', inject(function(guestbooks) {
			// Define a sample guestbook put data
			var sampleguestbookPutData = new guestbooks({
				_id: '525cf20451979dea2c000001',
				title: 'An guestbook about MEAN',
				content: 'MEAN Rocks!'
			});

			// Mock guestbook in scope
			scope.guestbook = sampleguestbookPutData;

			// Set PUT response
			$httpBackend.expectPUT(/api\/guestbooks\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/guestbooks/' + sampleguestbookPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid guestbookId and remove the guestbook from the scope', inject(function(guestbooks) {
			// Create new guestbook object
			var sampleguestbook = new guestbooks({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new guestbooks array and include the guestbook
			scope.guestbooks = [sampleguestbook];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/api\/guestbooks\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleguestbook);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.guestbooks.length).toBe(0);
		}));
	});
}());
