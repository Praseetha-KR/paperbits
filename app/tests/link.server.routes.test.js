'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Link = mongoose.model('Link'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, link;

/**
 * Link routes tests
 */
describe('Link CRUD tests', function() {
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

		// Save a user to the test db and create new link
		user.save(function() {
			link = {
				url: 'Link Url'
			};

			done();
		});
	});

	it('should be able to save an link if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new link
				agent.post('/links')
					.send(link)
					.expect(200)
					.end(function(linkSaveErr, linkSaveRes) {
						// Handle link save error
						if (linkSaveErr) done(linkSaveErr);

						// Get a list of links
						agent.get('/links')
							.end(function(linksGetErr, linksGetRes) {
								// Handle link save error
								if (linksGetErr) done(linksGetErr);

								// Get links list
								var links = linksGetRes.body;

								// Set assertions
								(links[0].user._id).should.equal(userId);
								(links[0].url).should.match('Link Url');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save an link if not logged in', function(done) {
		agent.post('/links')
			.send(link)
			.expect(401)
			.end(function(linkSaveErr, linkSaveRes) {
				// Call the assertion callback
				done(linkSaveErr);
			});
	});

	it('should not be able to save an link if no url is provided', function(done) {
		// Invalidate url field
		link.url = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new link
				agent.post('/links')
					.send(link)
					.expect(400)
					.end(function(linkSaveErr, linkSaveRes) {
						// Set message assertion
						(linkSaveRes.body.message).should.match('URL cannot be blank');

						// Handle link save error
						done(linkSaveErr);
					});
			});
	});

	it('should be able to update an link if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new link
				agent.post('/links')
					.send(link)
					.expect(200)
					.end(function(linkSaveErr, linkSaveRes) {
						// Handle link save error
						if (linkSaveErr) done(linkSaveErr);

						// Update link url
						link.url = 'WHY YOU GOTTA BE SO MEAN?';

						// Update an existing link
						agent.put('/links/' + linkSaveRes.body._id)
							.send(link)
							.expect(200)
							.end(function(linkUpdateErr, linkUpdateRes) {
								// Handle link update error
								if (linkUpdateErr) done(linkUpdateErr);

								// Set assertions
								(linkUpdateRes.body._id).should.equal(linkSaveRes.body._id);
								(linkUpdateRes.body.url).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of links if not signed in', function(done) {
		// Create new link model instance
		var linkObj = new Link(link);

		// Save the link
		linkObj.save(function() {
			// Request links
			request(app).get('/links')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single link if not signed in', function(done) {
		// Create new link model instance
		var linkObj = new Link(link);

		// Save the link
		linkObj.save(function() {
			request(app).get('/links/' + linkObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('url', link.url);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should return proper error for single link which doesnt exist, if not signed in', function(done) {
		request(app).get('/links/test')
			.end(function(req, res) {
				// Set assertion
				res.body.should.be.an.Object.with.property('message', 'Link is invalid');

				// Call the assertion callback
				done();
			});
	});

	it('should be able to delete an link if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new link
				agent.post('/links')
					.send(link)
					.expect(200)
					.end(function(linkSaveErr, linkSaveRes) {
						// Handle link save error
						if (linkSaveErr) done(linkSaveErr);

						// Delete an existing link
						agent.delete('/links/' + linkSaveRes.body._id)
							.send(link)
							.expect(200)
							.end(function(linkDeleteErr, linkDeleteRes) {
								// Handle link error error
								if (linkDeleteErr) done(linkDeleteErr);

								// Set assertions
								(linkDeleteRes.body._id).should.equal(linkSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete an link if not signed in', function(done) {
		// Set link user
		link.user = user;

		// Create new link model instance
		var linkObj = new Link(link);

		// Save the link
		linkObj.save(function() {
			// Try deleting link
			request(app).delete('/links/' + linkObj._id)
			.expect(401)
			.end(function(linkDeleteErr, linkDeleteRes) {
				// Set message assertion
				(linkDeleteRes.body.message).should.match('User is not logged in');

				// Handle link error error
				done(linkDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function() {
			Link.remove().exec(done);
		});
	});
});
