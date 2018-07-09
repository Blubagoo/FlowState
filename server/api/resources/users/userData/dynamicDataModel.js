'use stric';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const DynamicSchema = mongoose.Schema({
	user: String,
	date: {
		type: Date, 
		default: Date.now
	},
	frames: [{
		anger: Number,
    disgust: Number,
    fear: Number,
    joy: Number,
    sadness: Number,
    surprise: Number 
  }]
});

const Dynamic = mongoose.model('dynamic', DynamicSchema);

module.exports = {Dynamic};