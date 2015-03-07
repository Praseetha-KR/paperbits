'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Image Schema
 */
var ImageSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	url: {
		type: String,
		default: '',
		required: 'URL cannot be blank'
	},
	resized_url: {
		type: String,
		default: ''
	},
	tags: {
		type: Array,
		default: []
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Image', ImageSchema);
