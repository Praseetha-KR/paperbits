'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
	notes = require('../../app/controllers/notes.server.controller');

module.exports = function(app) {
	// Note Routes
	app.route('/notes')
		.get(notes.list)
		.post(users.requiresLogin, notes.create);

	app.route('/notes/:noteId')
		.get(notes.read)
		.put(users.requiresLogin, notes.hasAuthorization, notes.update)
		.delete(users.requiresLogin, notes.hasAuthorization, notes.delete);

	// Finish by binding the note middleware
	app.param('noteId', notes.noteByID);
};
