//k歌增强组件
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var ktv = new Schema({
	tid: String,
  cid: String,
  gid: String
});

mongoose.model('Ktv', ktv);