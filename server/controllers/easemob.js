'use strict';

var mongoose = require('mongoose'),
  Company = mongoose.model('Company'),
  Campaign = mongoose.model('Campaign'),
  Config = mongoose.model('Config'),
  User = mongoose.model('User');
var easemobService = require('../service/addEasemob');
exports.home = function(req,res){
  res.render('system/easemob');
}
exports.info = function(req,res){
  Config.findOne({
    name: 'admin'
  }).exec()
    .then(function (config) {
      if (!config) {
        return res.send({msg:"no config"})
      }
      res.send(config.easemob)
    })
    .then(null, function (err) {
      return res.status(500).send({msg:"error"})
    });
}
exports.save = function(req,res){
  var conditions = { name: 'admin' },
  update = { $set: { easemob: req.body.easemob }},
  options = { multi: false };

  Config.update(conditions, update, options, callback);

  function callback (err, numAffected) {
    if(err){
      res.send({msg:"环信配置修改失败"})
    }
    else{
      console.log(err);
      res.send({msg:"环信配置修改成功"})
    }
  }
}
exports.initHrUser = function(req,res){
  easemobService.addHrUsers(function (data) {
    res.send(data);
  })
}
exports.initUser = function(req,res){
  easemobService.addUsers(function (data) {
    res.send(data);
  })
}
exports.initGroup = function(req,res){
  easemobService.addGroups(function (data) {
    res.send(data);
  })
}


