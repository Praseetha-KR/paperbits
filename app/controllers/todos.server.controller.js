'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Todo = mongoose.model('Todo'),
	_ = require('lodash');

/**
 * Create a todo
 */
exports.create = function(req, res) {
	var todo = new Todo(req.body);
	todo.user = req.user;

	todo.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(todo);
		}
	});
};

/**
 * Show the current todo
 */
exports.read = function(req, res) {
	res.json(req.todo);
};

/**
 * Update a todo
 */
exports.update = function(req, res) {
	var todo = req.todo;

	todo = _.extend(todo, req.body);

	todo.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(todo);
		}
	});
};

/**
 * Delete an todo
 */
exports.delete = function(req, res) {
	var todo = req.todo;

	todo.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(todo);
		}
	});
};

/**
 * List of Todos
 */
exports.list = function(req, res) {
	Todo.find().sort('-created').populate('user', 'displayName').exec(function(err, todos) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(todos);
		}
	});
};

/**
 * Todo middleware
 */
exports.todoByID = function(req, res, next, id) {

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).send({
			message: 'Todo is invalid'
		});
	}

	Todo.findById(id).populate('user', 'displayName').exec(function(err, todo) {
		if (err) return next(err);
		if (!todo) {
			return res.status(404).send({
  				message: 'Todo not found'
  			});
		}
		req.todo = todo;
		next();
	});
};

/**
 * Todo authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.todo.user.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};