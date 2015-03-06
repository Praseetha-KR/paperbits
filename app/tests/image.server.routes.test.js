'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Images = mongoose.model('Image'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, image;

/**
 * Image routes tests
 */
describe('Image CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new image
		user.save(function() {
			image = {
				url: 'Image Url'
			};

			done();
		});
	});

	it('should be able to save an image if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new image
				agent.post('/images')
					.send(image)
					.expect(200)
					.end(function(imageSaveErr, imageSaveRes) {
						// Handle image save error
						if (imageSaveErr) done(imageSaveErr);

						// Get a list of images
						agent.get('/images')
							.end(function(imagesGetErr, imagesGetRes) {
								// Handle image save error
								if (imagesGetErr) done(imagesGetErr);

								// Get images list
								var images = imagesGetRes.body;

								// Set assertions
								(images[0].user._id).should.equal(userId);
								(images[0].url).should.match('Image Url');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save an image if not logged in', function(done) {
		agent.post('/images')
			.send(image)
			.expect(401)
			.end(function(imageSaveErr, imageSaveRes) {
				// Call the assertion callback
				done(imageSaveErr);
			});
	});

	it('should not be able to save an image if no url is provided', function(done) {
		// Invalidate url field
		image.url = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new image
				agent.post('/images')
					.send(image)
					.expect(400)
					.end(function(imageSaveErr, imageSaveRes) {
						// Set message assertion
						(imageSaveRes.body.message).should.match('URL cannot be blank');

						// Handle image save error
						done(imageSaveErr);
					});
			});
	});

	it('should be able to update an image if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new image
				agent.post('/images')
					.send(image)
					.expect(200)
					.end(function(imageSaveErr, imageSaveRes) {
						// Handle image save error
						if (imageSaveErr) done(imageSaveErr);

						// Update image url
						image.url = 'WHY YOU GOTTA BE SO MEAN?';

						// Update an existing image
						agent.put('/images/' + imageSaveRes.body._id)
							.send(image)
							.expect(200)
							.end(function(imageUpdateErr, imageUpdateRes) {
								// Handle image update error
								if (imageUpdateErr) done(imageUpdateErr);

								// Set assertions
								(imageUpdateRes.body._id).should.equal(imageSaveRes.body._id);
								(imageUpdateRes.body.url).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of images if not signed in', function(done) {
		// Create new image model instance
		var imageObj = new Images(image);

		// Save the image
		imageObj.save(function() {
			// Request images
			request(app).get('/images')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single image if not signed in', function(done) {
		// Create new image model instance
		var imageObj = new Images(image);

		// Save the image
		imageObj.save(function() {
			request(app).get('/images/' + imageObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('url', image.url);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should return proper error for single image which doesnt exist, if not signed in', function(done) {
		request(app).get('/images/test')
			.end(function(req, res) {
				// Set assertion
				res.body.should.be.an.Object.with.property('message', 'Image is invalid');

				// Call the assertion callback
				done();
			});
	});

	it('should be able to delete an image if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new image
				agent.post('/images')
					.send(image)
					.expect(200)
					.end(function(imageSaveErr, imageSaveRes) {
						// Handle image save error
						if (imageSaveErr) done(imageSaveErr);

						// Delete an existing image
						agent.delete('/images/' + imageSaveRes.body._id)
							.send(image)
							.expect(200)
							.end(function(imageDeleteErr, imageDeleteRes) {
								// Handle image error error
								if (imageDeleteErr) done(imageDeleteErr);

								// Set assertions
								(imageDeleteRes.body._id).should.equal(imageSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete an image if not signed in', function(done) {
		// Set image user
		image.user = user;

		// Create new image model instance
		var imageObj = new Images(image);

		// Save the image
		imageObj.save(function() {
			// Try deleting image
			request(app).delete('/images/' + imageObj._id)
			.expect(401)
			.end(function(imageDeleteErr, imageDeleteRes) {
				// Set message assertion
				(imageDeleteRes.body.message).should.match('User is not logged in');

				// Handle image error error
				done(imageDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function() {
			Images.remove().exec(done);
		});
	});
});
