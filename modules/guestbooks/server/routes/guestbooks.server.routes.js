//fourth step
'use strict';

/**
 * Module dependencies.
 */
var guestbooksPolicy = require('../policies/guestbooks.server.policy'),
	guestbooks = require('../controllers/guestbooks.server.controller'),
	comment= require('../controllers/comments.server.controller');

module.exports = function(app) {
	// guestbooks collection routes
	app.route('/api/guestbooks').all(guestbooksPolicy.isAllowed)
		.get(guestbooks.list)
		.post(guestbooks.create);
	app.route('/api/guestbooks/:guestbookId').all(guestbooksPolicy.isAllowed)
		.get(guestbooks.read)
		.delete(guestbooks.delete);
	app.route('/api/comment').all(guestbooksPolicy.isAllowed)
		.post(comment.create);
		//.get(comment.list);

	app.param('guestbookId', guestbooks.guestbookByID);
	app.param('commentId', comment.commentByID);
};
