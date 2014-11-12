'use strict';

// mongoose models
var mongoose = require('mongoose'),
  Log = mongoose.model('Log');


//获取错误日志
exports.getLogs = function(req,res){
  Log.find().sort({'created':-1}).limit(100).exec(function(err,logs){
    if(err || !logs){
      res.send({'msg':'ERROR_FETCH_FAILED','result':0});
    }else{
      res.send({'msg':'ERROR_FETCH_SUCCESS','result':1,'logs':logs});
    }
  });
}


exports.home = function(req ,res){
  res.render('system/log');
}