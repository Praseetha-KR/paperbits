'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Todo Schema
 */
var TodoSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	task: {
		type: String,
		default: '',
		trim: true,
		required: 'Title cannot be blank'
	},
	content: {
		type: String,
		default: '',
		trim: true
	},
	priority: {
		type: Number,
		default: 1
	},
	done: {
		type: Boolean,
		default: 0
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Todo', TodoSchema);