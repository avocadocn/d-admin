'use strict';

var mongoose = require('mongoose'),
  Company = mongoose.model('Company'),
  Campaign = mongoose.model('Campaign'),
  Config = mongoose.model('Config'),
  User = mongoose.model('User');



var APP = function(callback,new_param){
  this.TYPE = null;
  this.callback = callback;
  this.param = new_param;
  this.get = function(){
    Config.findOne({'name':'admin'},function (err,config){
      if(err || !config){
        this.callback(0,err,config);
      }else{
        if(config.push){
          this.callback(1,config.push[this.TYPE]);
        }else{
          this.callback(0,'NO_PUSH');
        }
      }
    });
  }
  this.set = function(){
    Config.update({'name':'admin'},{'$set':this.param},function (err,config){
      if(err || !config){
        this.callback(0,err,config);
      }else{
        this.callback(1,'APP_SET_SUCCESS');
      }
    });
  }
}



exports.apn = function(){

}


exporta.baidu = function(){

}