'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Link Schema
 */
var LinkSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	url: {
		type: String,
		default: '',
		required: 'URL cannot be blank'
	},
	title: {
		type: String,
		default: ''
	},
	description: {
		type: String,
		default: ''
	},
	thumbnail_url: {
		type: String,
		default: ''
	},
	provider_name: {
		type: String,
		default: ''
	},
	provider_url: {
		type: String,
		default: ''
	},
	tags: {
		type: Array,
		default: ['Bookmark']
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Link', LinkSchema);
