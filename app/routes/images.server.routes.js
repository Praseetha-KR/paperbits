'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
	images = require('../../app/controllers/images.server.controller');

module.exports = function(app) {
	// Image Routes
	app.route('/images')
		.get(images.list)
		.post(users.requiresLogin, images.create);

	app.route('/images/:imageId')
		.get(images.read)
		.put(users.requiresLogin, images.hasAuthorization, images.update)
		.delete(users.requiresLogin, images.hasAuthorization, images.delete);

	// Finish by binding the image middleware
	app.param('imageId', images.imageByID);
};
