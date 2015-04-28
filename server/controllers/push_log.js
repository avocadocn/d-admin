'use strict';

// mongoose models
var mongoose = require('mongoose'),
  PushLog = mongoose.model('PushLog');


//获取错误日志
exports.getLogs = function(req, res){
  PushLog.find({}).limit(100).exec().then(function(logs) {
    res.send({pushLogs: logs});
  }, function(err) {
    console.log(err);
    res.status(500).send({msg: err});
  });
}


exports.page = function(req ,res){
  res.render('system/push_log');
}