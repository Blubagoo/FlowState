'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const DataSchema = mongoose.Schema({
	user: String,
	date: {
		type: Date,
		default: Date.now
	},
	anger: Number,
	disgust: Number,
	fear: Number,
	joy: Number,
	sadness: Number,
	surprise: Number,
	glances: Number,
	dwell: Number,
	attention: Number,
	positive: Number,
	negative: Number,
	neutral: Number
});


DataSchema.methods.serialize = function() {
	return {
		user: this.user || "",
		date: this.date || "",
		anger: this.anger || "",
		disgust: this.disgust || "",
		fear: this.fear || "",
		joy: this.joy || "",
		sadness: this.sadness || "",
		surprise: this.surprise || "", 
		glances: this.glances || "",
		dwell: this.dwell || "",
		attention: this.attention || "",
		positive: this.positive || "",
		negative: this.negative || "",
		neutral: this.neutral || ""
	};
};


const Data = mongoose.model('data', DataSchema);

module.exports = {Data};
