//动梨给各个企业用户发送站内信


'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var InternalMessageSchema = new Schema({
  id: String,
  company: {
    id: String,
    name: String
  },
  content: String,
  date: {
    type: Date,
    default: Date.now()
  }
});

mongoose.model('InternalMessage', InternalMessageSchema);