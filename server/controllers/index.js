'use strict';

// mongoose models
var mongoose = require('mongoose'),
  Admin = mongoose.model('Admin'),
  Config = mongoose.model('Config');

exports.render = function(req, res) {
	res.render('index');
};

exports.createAdminView = function(req, res) {
  res.render('create');
};

exports.createAdmin = function(req, res) {
  var admin = new Admin({
    email: req.body.email,
    password: req.body.password
  });
  admin.save(function(err) {
    if (err) {
      console.log(err);
      res.render('create', { message: '创建失败' });
    } else {
      res.render('create', { message: '创建成功' });
    }
  });
};


// 临时地初始化设置，以后需要移至别处。
exports.init = function(req, res) {
  var config = new Config({ name: 'donler', company_register_need_invite: true });
  config.save(function(err) {
    if (err) res.send({ r: err });
    else res.send({ r: 'init success' });
  });
};