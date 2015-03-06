'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
	links = require('../../app/controllers/links.server.controller');

module.exports = function(app) {
	// Link Routes
	app.route('/links')
		.get(links.list)
		.post(users.requiresLogin, links.create);

	app.route('/links/:linkId')
		.get(links.read)
		.put(users.requiresLogin, links.hasAuthorization, links.update)
		.delete(users.requiresLogin, links.hasAuthorization, links.delete);

	// Finish by binding the link middleware
	app.param('linkId', links.linkByID);
};
