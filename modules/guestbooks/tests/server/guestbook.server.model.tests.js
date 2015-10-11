'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	guestbook = mongoose.model('guestbook');

/**
 * Globals
 */
var user, guestbook;

/**
 * Unit tests
 */
describe('guestbook Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() {
			guestbook = new guestbook({
				title: 'guestbook Title',
				content: 'guestbook Content',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return guestbook.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without title', function(done) {
			guestbook.title = '';

			return guestbook.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) {
		guestbook.remove().exec(function() {
			User.remove().exec(done);
		});
	});
});
