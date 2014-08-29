'use strict';

var mongoose = require('mongoose'),
  Company = mongoose.model('Company'),
  Campaign = mongoose.model('Campaign'),
  Config = mongoose.model('Config'),
  User = mongoose.model('User');


var APP = function(callback,type){
  this.TYPE = type;
  this.callback = callback;
  this.param = null;
  this.setModifyData = function(param){
    this.param = param;
  }
  this.get = function(){
    var _callback = this.callback;
    Config.findOne({'name':'admin'},function (err,config){
      if(err || !config){
        _callback(0,err);
      }else{
        if(config.push){
          _callback(1,config.push[this.TYPE]);
        }else{
          _callback(0,'NO_PUSH');
        }
      }
    });
  }
  this.set = function(){
    var _callback = this.callback;
    Config.update({'name':'admin'},{'$set':this.param},function (err,config){
      if(err || !config){
        _callback(0,err);
      }else{
        _callback(1,this.param);
      }
    });
  }
}

exports.apn = function(req,res){
  console.log(1);
  var callback = function(code,data){
    return res.send({'result':code,'data':data})
  }
  var app = new APP(callback,'apn');
  var operate = req.body.operate;
  if(operate =='get'){
    app.get();
  }
  if(operate == 'set'){
    app.setModifyData(req.body.data);
    app.set();
  }
}

exports.baidu = function(req,res){
  var callback = function(code,data){
    console.log(code,data);
    return res.send({'result':code,'data':data})
  }
  var app = new APP(callback,'baidu');
  var operate = req.body.operate;
  if(operate =='get'){
    app.get();
  }
  if(operate == 'set'){
    app.setModifyData(req.body.data);
    app.set();
  }
}

exports.config = function(req,res){
  var operate = req.body.operate;
  if(operate == 'set'){
    var s;
    if(req.body.data.value == 'on'){
      s = 'off';
    }
    if(req.body.data.value == 'off'){
      s = 'on';
    }
    Config.update({'name':'admin'},{'push.status':s},function (err,config){
      if(err || !config){
        return res.send({'msg':'PUSH_MODIFY_ERROR','result':0});
      }else{
        return res.send({'msg':'PUSH_MODIFY_SUCCESS','result':1,'data':{value:s}});
      }
    });
  }
  if(operate == 'get'){
    Config.findOne({'name':'admin'},function (err,config){
      if(err || !config){
        return res.send({'msg':'PUSH_FETCH_ERROR','result':0});
      }else{
        return res.send({'msg':'PUSH_FETCH_SUCCESS','result':1, 'data':{value:config.push.status}});
      }
    })
  }
}

exports.info = function(req,res){
  User.find({'device':{'$exists':true}},{'device':1,'username':1,'cname':1},function (err,users){
    if (err || !users){
      console.log(users);
      return res.send({'msg':'NOT_FIND_USERS','result':0});
    }else{
      return res.send({'msg':'INFO_SUCCESS','result':1,'data':users});
    }
  });
}
exports.home = function(req,res){
  res.render('system/app');
}