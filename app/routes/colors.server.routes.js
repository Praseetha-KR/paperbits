'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
	colors = require('../../app/controllers/colors.server.controller');

module.exports = function(app) {
	// Article Routes
	app.route('/colors')
		.get(colors.list)
		.post(users.requiresLogin, colors.create);

	app.route('/colors/:colorId')
		.get(colors.read)
		.put(users.requiresLogin, colors.hasAuthorization, colors.update)
		.delete(users.requiresLogin, colors.hasAuthorization, colors.delete);

	// Finish by binding the article middleware
	app.param('colorId', colors.colorByID);
};