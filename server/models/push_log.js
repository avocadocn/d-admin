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
  campaign: {
    type: Schema.Types.ObjectId,
    ref: 'Campaign'
  },
  pushTime: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('PushLog', PushLog);