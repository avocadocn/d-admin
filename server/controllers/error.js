'use strict';

// mongoose models
var mongoose = require('mongoose'),
  Error = mongoose.model('ErrorStatistics');


//获取错误日志
exports.getErrorStatics = function(req,res){
  Error.find({'status':'active'}).sort({'date':-1}).limit(100).exec(function(err,error){
    if(err || !error){
      res.send({'msg':'ERROR_FETCH_FAILED','result':0});
    }else{
      res.send({'msg':'ERROR_FETCH_SUCCESS','result':1,'error':error});
    }
  });
}


//增加错误日志
exports.addErrorItem = function(target,type,body){
  var operate = {
    error:{
      target:{
        kind:target.type,
        _id:target._id,
        name:target.name,
        username:target.username,
        email:target.email
      },
      kind:type,
      body:body
    }
  };
  Error.create(operate,function(err,error){
    if(err || !error){
      return {'msg':'ERROR_ADD_FAILED','result':0};
    } else {
      return {'msg':'ERROR_ADD_SUCCESS','result':1};
    }
  });
}

//删除错误日志
exports.deleteErrorItem = function(req,res){
  var _id = req.body._id;
  Error.update({'_id':req.body._id},{'$set':{'status':'delete'}},function (err,error){
    if(err || !error){
      return {'msg':'ERROR_DELETE_FAILED','result':0};
    } else {
      return {'msg':'ERROR_DELETE_SUCCESS','result':1};
    }
  });
}