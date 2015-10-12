'use strict';

/**
 * Module dependencies.
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke guestbooks Permissions
 */
exports.invokeRolesPolicies = function() {
	acl.allow([{
		roles: ['admin'],
		allows: [{
			resources: '/api/guestbooks',
			permissions: '*'
		}, {
			resources: '/api/comment',
			permissions: '*'
		},{
			resources: '/api/guestbooks/:guestbookId',
			permissions: '*'
		}]
	}, {
		roles: ['user'],
		allows: [{
			resources: '/api/guestbooks',
			permissions: ['get', 'post']
		}, {
			resources: '/api/guestbooks/:guestbookId',
			permissions: ['get','put']
		},{
			resources: '/api/comment',
			permissions: '*'
		}]
	}, {
		roles: ['guest'],
		allows: [{
			resources: '/api/guestbooks',
			permissions: ['get']
		}, {
			resources: '/api/comment',
			permissions: ['get']
		},{
			resources: '/api/guestbooks/:guestbookId',
			permissions: ['get']
		}]
	}]);
};

/**
 * Check If guestbooks Policy Allows
 */
exports.isAllowed = function(req, res, next) {
	var roles = (req.user) ? req.user.roles : ['guest'];

	// If an guestbook is being processed and the current user created it then allow any manipulation
	if (req.guestbook && req.user && req.guestbook.user.id === req.user.id) {
		return next();
	}

	// Check for user roles
	acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function(err, isAllowed) {
		if (err) {
			// An authorization error occurred.
			return res.status(500).send('Unexpected authorization error');
		} else {
			if (isAllowed) {
				// Access granted! Invoke next middleware
				return next();
			} else {
				return res.status(403).json({
					message: 'User is not authorized'
				});
			}
		}
	});
};
