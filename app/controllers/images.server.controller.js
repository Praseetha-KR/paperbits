'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Images = mongoose.model('Image'),
	_ = require('lodash'),
	config = require('../../config/config');

function resizeImage(url) {
	return 'http://i.embed.ly/1/display/resize?height=500&width=500&url=' + url.replace(/\//g,'%2F').replace(/:/g,'%3A') + '&key=' + config.embedly.key;
}
/**
 * Create a image
 */
exports.create = function(req, res) {
	var image = new Images(req.body);
	image.resized_url = resizeImage(image.url);
	image.user = req.user;

	image.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)

			});
		} else {
			res.json(image);
		}
	});
};

/**
 * Show the current image
 */
exports.read = function(req, res) {
	res.json(req.image);
};

/**
 * Update a image
 */
exports.update = function(req, res) {
	var image = req.image;

	image = _.extend(image, req.body);
	image.resized_url = resizeImage(image.url);

	image.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(image);
		}
	});
};

/**
 * Delete an image
 */
exports.delete = function(req, res) {
	var image = req.image;

	image.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(image);
		}
	});
};

/**
 * List of Images
 */
exports.list = function(req, res) {
	Images.find().sort('-created').populate('user', 'displayName').exec(function(err, images) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(images);
		}
	});
};

/**
 * Image middleware
 */
exports.imageByID = function(req, res, next, id) {

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).send({
			message: 'Image is invalid'
		});
	}

	Images.findById(id).populate('user', 'displayName').exec(function(err, image) {
		if (err) return next(err);
		if (!image) {
			return res.status(404).send({
				message: 'Image not found'
			});
		}
		req.image = image;
		next();
	});
};

/**
 * Image authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.image.user.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};
