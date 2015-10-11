//fourth step
'use strict';

/**
 * Module dependencies.
 */
var guestbooksPolicy = require('../policies/guestbooks.server.policy'),
	guestbooks = require('../controllers/guestbooks.server.controller');
	//comments = require('../controllers/comments.server.controller');

module.exports = function(app) {
	// guestbooks collection routes
	app.route('/api/guestbooks').all(guestbooksPolicy.isAllowed)
		.get(guestbooks.list)
		.post(guestbooks.create);
	app.route('/api/guestbooks/:guestbookId').all(guestbooksPolicy.isAllowed)
		.get(guestbooks.read)
		.put(guestbooks.commentCreate)
		.delete(guestbooks.delete);

	app.param('guestbookId', guestbooks.guestbookByID);
};
