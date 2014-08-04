'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');

var _num = new Schema({
	total_num:Number,
	unactive_num:Number,
	active_num:Number
});

var StatisticsShema = new Schema({
	company_num:[_num],
	member_num:[_num]
});


mongoose.model('Statistics', StatisticsShema);