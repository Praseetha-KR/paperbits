'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Link = mongoose.model('Link'),
	_ = require('lodash');

/**
 * Create a link
 */
exports.create = function(req, res) {
	var link = new Link(req.body);
	link.user = req.user;

	link.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(link);
		}
	});
};

/**
 * Show the current link
 */
exports.read = function(req, res) {
	res.json(req.link);
};

/**
 * Update a link
 */
exports.update = function(req, res) {
	var link = req.link;

	link = _.extend(link, req.body);

	link.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(link);
		}
	});
};

/**
 * Delete an link
 */
exports.delete = function(req, res) {
	var link = req.link;

	link.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(link);
		}
	});
};

/**
 * List of Links
 */
exports.list = function(req, res) {
	Link.find().sort('-created').populate('user', 'displayName').exec(function(err, links) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(links);
		}
	});
};

/**
 * Link middleware
 */
exports.linkByID = function(req, res, next, id) {

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).send({
			message: 'Link is invalid'
		});
	}

	Link.findById(id).populate('user', 'displayName').exec(function(err, link) {
		if (err) return next(err);
		if (!link) {
			return res.status(404).send({
				message: 'Link not found'
			});
		}
		req.link = link;
		next();
	});
};

/**
 * Link authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.link.user.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};
