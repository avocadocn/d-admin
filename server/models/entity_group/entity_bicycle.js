//自行车增强组件
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var bicycle = new Schema({
	tid: String,
  cid: String,
  gid: String
});

mongoose.model('Bicycle', bicycle);