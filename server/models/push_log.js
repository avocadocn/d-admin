'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PushLog = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref:'User'
  },
  device: Schema.Types.Mixed,
  push_title: String,
  push_msg: String,
  push_time: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['success', 'fail'],
    default: 'success'
  }
});

mongoose.model('PushLog', PushLog);