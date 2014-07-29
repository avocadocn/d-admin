'use strict';

// mongoose models
var mongoose = require('mongoose'),
  Config = mongoose.model('Config');

exports.render = function(req, res) {
  //由于 req.user 无法存入数据库,暂时只能用session
  if(req.session){
    if(req.session.admin){
      return req.session.admin.role == 'admin' ? res.render('index',{'name':req.session.admin.name}) : res.render('login');
    }else{
      return res.render('login');
    }
  }else{
    return res.render('login');
  }
  // if(req.user){
  //    if(req.user.roles.indexOf('admin') > -1){
  //      return res.redirect('/#/mamager');
  //    }
  //  }
  //  return res.render('login');
};


exports.login = function(req, res) {
  //由于 req.user 无法存入数据库,暂时只能用session
  if(req.session){
    if(req.session.admin){
      return req.session.admin.role == 'admin' ? res.render('index',{'name':req.session.admin.name}) : res.render('login');
    }else{
      return res.render('login');
    }
  }else{
    return res.render('login');
  }
  // if(req.user){
  //    if(req.user.roles.indexOf('admin') > -1){
  //      return res.redirect('/#/mamager');
  //    }
  //  }
  //  return res.render('login');
};