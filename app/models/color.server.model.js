'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Color Schema
 */
var ColorSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	color_value: {
		type: String,
		default: '#FFFFFF',
		trim: true,
		required: 'Color value cannot be blank'
	},
	hex: {
		type: String,
		default: '#FFFFFF',
	},
	rgb: {
		type: String,
		default: 'rgb(255,255,255)',
	},
	hsl: {
		type: String,
		default: 'hsl(100,50,0)',
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Color', ColorSchema);