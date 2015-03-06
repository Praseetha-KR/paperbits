'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Color = mongoose.model('Color'),
	_ = require('lodash');

/**
 * Create a color
 */
exports.create = function(req, res) {
	var color = new Color(req.body);
	color.user = req.user;

	color.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(color);
		}
	});
};

/**
 * Show the current color
 */
exports.read = function(req, res) {
	res.json(req.color);
};

/**
 * Update a color
 */
exports.update = function(req, res) {
	var color = req.color;

	color = _.extend(color, req.body);

	color.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(color);
		}
	});
};

/**
 * Delete an color
 */
exports.delete = function(req, res) {
	var color = req.color;

	color.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(color);
		}
	});
};

/**
 * List of Colors
 */
exports.list = function(req, res) {
	Color.find().sort('-created').populate('user', 'displayName').exec(function(err, colors) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(colors);
		}
	});
};

/**
 * Color middleware
 */
exports.colorByID = function(req, res, next, id) {

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).send({
			message: 'Color is invalid'
		});
	}

	Color.findById(id).populate('user', 'displayName').exec(function(err, color) {
		if (err) return next(err);
		if (!color) {
			return res.status(404).send({
  				message: 'Color not found'
  			});
		}
		req.color = color;
		next();
	});
};

/**
 * Color authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.color.user.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};