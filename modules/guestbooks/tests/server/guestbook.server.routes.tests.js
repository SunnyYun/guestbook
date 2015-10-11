'use strict';

var should = require('should'),
	request = require('supertest'),
	path = require('path'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	guestbook = mongoose.model('guestbook'),
	express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, guestbook;

/**
 * guestbook routes tests
 */
describe('guestbook CRUD tests', function() {
	before(function(done) {
		// Get application
		app = express.init(mongoose);
		agent = request.agent(app);

		done();
	});

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

		// Save a user to the test db and create new guestbook
		user.save(function() {
			guestbook = {
				title: 'guestbook Title',
				content: 'guestbook Content'
			};

			done();
		});
	});

	it('should be able to save an guestbook if logged in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new guestbook
				agent.post('/api/guestbooks')
					.send(guestbook)
					.expect(200)
					.end(function(guestbookSaveErr, guestbookSaveRes) {
						// Handle guestbook save error
						if (guestbookSaveErr) done(guestbookSaveErr);

						// Get a list of guestbooks
						agent.get('/api/guestbooks')
							.end(function(guestbooksGetErr, guestbooksGetRes) {
								// Handle guestbook save error
								if (guestbooksGetErr) done(guestbooksGetErr);

								// Get guestbooks list
								var guestbooks = guestbooksGetRes.body;

								// Set assertions
								(guestbooks[0].user._id).should.equal(userId);
								(guestbooks[0].title).should.match('guestbook Title');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save an guestbook if not logged in', function(done) {
		agent.post('/api/guestbooks')
			.send(guestbook)
			.expect(403)
			.end(function(guestbookSaveErr, guestbookSaveRes) {
				// Call the assertion callback
				done(guestbookSaveErr);
			});
	});

	it('should not be able to save an guestbook if no title is provided', function(done) {
		// Invalidate title field
		guestbook.title = '';

		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new guestbook
				agent.post('/api/guestbooks')
					.send(guestbook)
					.expect(400)
					.end(function(guestbookSaveErr, guestbookSaveRes) {
						// Set message assertion
						(guestbookSaveRes.body.message).should.match('Title cannot be blank');

						// Handle guestbook save error
						done(guestbookSaveErr);
					});
			});
	});

	it('should be able to update an guestbook if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new guestbook
				agent.post('/api/guestbooks')
					.send(guestbook)
					.expect(200)
					.end(function(guestbookSaveErr, guestbookSaveRes) {
						// Handle guestbook save error
						if (guestbookSaveErr) done(guestbookSaveErr);

						// Update guestbook title
						guestbook.title = 'WHY YOU GOTTA BE SO MEAN?';

						// Update an existing guestbook
						agent.put('/api/guestbooks/' + guestbookSaveRes.body._id)
							.send(guestbook)
							.expect(200)
							.end(function(guestbookUpdateErr, guestbookUpdateRes) {
								// Handle guestbook update error
								if (guestbookUpdateErr) done(guestbookUpdateErr);

								// Set assertions
								(guestbookUpdateRes.body._id).should.equal(guestbookSaveRes.body._id);
								(guestbookUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of guestbooks if not signed in', function(done) {
		// Create new guestbook model instance
		var guestbookObj = new guestbook(guestbook);

		// Save the guestbook
		guestbookObj.save(function() {
			// Request guestbooks
			request(app).get('/api/guestbooks')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single guestbook if not signed in', function(done) {
		// Create new guestbook model instance
		var guestbookObj = new guestbook(guestbook);

		// Save the guestbook
		guestbookObj.save(function() {
			request(app).get('/api/guestbooks/' + guestbookObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('title', guestbook.title);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete an guestbook if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new guestbook
				agent.post('/api/guestbooks')
					.send(guestbook)
					.expect(200)
					.end(function(guestbookSaveErr, guestbookSaveRes) {
						// Handle guestbook save error
						if (guestbookSaveErr) done(guestbookSaveErr);

						// Delete an existing guestbook
						agent.delete('/api/guestbooks/' + guestbookSaveRes.body._id)
							.send(guestbook)
							.expect(200)
							.end(function(guestbookDeleteErr, guestbookDeleteRes) {
								// Handle guestbook error error
								if (guestbookDeleteErr) done(guestbookDeleteErr);

								// Set assertions
								(guestbookDeleteRes.body._id).should.equal(guestbookSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete an guestbook if not signed in', function(done) {
		// Set guestbook user
		guestbook.user = user;

		// Create new guestbook model instance
		var guestbookObj = new guestbook(guestbook);

		// Save the guestbook
		guestbookObj.save(function() {
			// Try deleting guestbook
			request(app).delete('/api/guestbooks/' + guestbookObj._id)
			.expect(403)
			.end(function(guestbookDeleteErr, guestbookDeleteRes) {
				// Set message assertion
				(guestbookDeleteRes.body.message).should.match('User is not authorized');

				// Handle guestbook error error
				done(guestbookDeleteErr);
			});

		});
	});

    it('should not be able to delete an guestbook if not signed in');

	afterEach(function(done) {
		User.remove().exec(function() {
			guestbook.remove().exec(done);
		});
	});
});
