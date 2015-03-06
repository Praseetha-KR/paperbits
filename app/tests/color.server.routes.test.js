'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Color = mongoose.model('Color'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, color;

/**
 * Color routes tests
 */
describe('Color CRUD tests', function() {
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

		// Save a user to the test db and create new color
		user.save(function() {
			color = {
				color_value: '#FFFFFF'
			};

			done();
		});
	});

	it('should be able to save an color if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new color
				agent.post('/colors')
					.send(color)
					.expect(200)
					.end(function(colorSaveErr, colorSaveRes) {
						// Handle color save error
						if (colorSaveErr) done(colorSaveErr);

						// Get a list of colors
						agent.get('/colors')
							.end(function(colorsGetErr, colorsGetRes) {
								// Handle color save error
								if (colorsGetErr) done(colorsGetErr);

								// Get colors list
								var colors = colorsGetRes.body;

								// Set assertions
								(colors[0].user._id).should.equal(userId);
								(colors[0].color_value).should.match('#FFFFFF');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save an color if not logged in', function(done) {
		agent.post('/colors')
			.send(color)
			.expect(401)
			.end(function(colorSaveErr, colorSaveRes) {
				// Call the assertion callback
				done(colorSaveErr);
			});
	});

	it('should not be able to save an color if no color_value is provided', function(done) {
		// Invalidate color_value field
		color.color_value = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new color
				agent.post('/colors')
					.send(color)
					.expect(400)
					.end(function(colorSaveErr, colorSaveRes) {
						// Set message assertion
						(colorSaveRes.body.message).should.match('Color value cannot be blank');
						
						// Handle color save error
						done(colorSaveErr);
					});
			});
	});

	it('should be able to update an color if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new color
				agent.post('/colors')
					.send(color)
					.expect(200)
					.end(function(colorSaveErr, colorSaveRes) {
						// Handle color save error
						if (colorSaveErr) done(colorSaveErr);

						// Update color color_value
						color.color_value = '#FFFFFF';

						// Update an existing color
						agent.put('/colors/' + colorSaveRes.body._id)
							.send(color)
							.expect(200)
							.end(function(colorUpdateErr, colorUpdateRes) {
								// Handle color update error
								if (colorUpdateErr) done(colorUpdateErr);

								// Set assertions
								(colorUpdateRes.body._id).should.equal(colorSaveRes.body._id);
								(colorUpdateRes.body.color_value).should.match('#FFFFFF');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of colors if not signed in', function(done) {
		// Create new color model instance
		var colorObj = new Color(color);

		// Save the color
		colorObj.save(function() {
			// Request colors
			request(app).get('/colors')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single color if not signed in', function(done) {
		// Create new color model instance
		var colorObj = new Color(color);

		// Save the color
		colorObj.save(function() {
			request(app).get('/colors/' + colorObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('color_value', color.color_value);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should return proper error for single color which doesnt exist, if not signed in', function(done) {
		request(app).get('/colors/test')
			.end(function(req, res) {
				// Set assertion
				res.body.should.be.an.Object.with.property('message', 'Color is invalid');

				// Call the assertion callback
				done();
			});
	});

	it('should be able to delete an color if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new color
				agent.post('/colors')
					.send(color)
					.expect(200)
					.end(function(colorSaveErr, colorSaveRes) {
						// Handle color save error
						if (colorSaveErr) done(colorSaveErr);

						// Delete an existing color
						agent.delete('/colors/' + colorSaveRes.body._id)
							.send(color)
							.expect(200)
							.end(function(colorDeleteErr, colorDeleteRes) {
								// Handle color error error
								if (colorDeleteErr) done(colorDeleteErr);

								// Set assertions
								(colorDeleteRes.body._id).should.equal(colorSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete an color if not signed in', function(done) {
		// Set color user 
		color.user = user;

		// Create new color model instance
		var colorObj = new Color(color);

		// Save the color
		colorObj.save(function() {
			// Try deleting color
			request(app).delete('/colors/' + colorObj._id)
			.expect(401)
			.end(function(colorDeleteErr, colorDeleteRes) {
				// Set message assertion
				(colorDeleteRes.body.message).should.match('User is not logged in');

				// Handle color error error
				done(colorDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function() {
			Color.remove().exec(done);	
		});
	});
});
