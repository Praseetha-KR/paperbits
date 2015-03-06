'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Note = mongoose.model('Note'),
	_ = require('lodash');

/**
 * Create a note
 */
exports.create = function(req, res) {
	var note = new Note(req.body);
	note.user = req.user;

	note.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(note);
		}
	});
};

/**
 * Show the current note
 */
exports.read = function(req, res) {
	res.json(req.note);
};

/**
 * Update a note
 */
exports.update = function(req, res) {
	var note = req.note;

	note = _.extend(note, req.body);

	note.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(note);
		}
	});
};

/**
 * Delete an note
 */
exports.delete = function(req, res) {
	var note = req.note;

	note.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(note);
		}
	});
};

/**
 * List of Notes
 */
exports.list = function(req, res) {
	Note.find().sort('-created').populate('user', 'displayName').exec(function(err, notes) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(notes);
		}
	});
};

/**
 * Note middleware
 */
exports.noteByID = function(req, res, next, id) {

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).send({
			message: 'Note is invalid'
		});
	}

	Note.findById(id).populate('user', 'displayName').exec(function(err, note) {
		if (err) return next(err);
		if (!note) {
			return res.status(404).send({
				message: 'Note not found'
			});
		}
		req.note = note;
		next();
	});
};

/**
 * Note authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.note.user.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};
