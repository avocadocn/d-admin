'use strict';

// mongoose models
var mongoose = require('mongoose'),
  Admin = mongoose.model('Admin');

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
  })
};