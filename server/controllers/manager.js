'use strict';

var mongoose = require('mongoose'),
  Company = mongoose.model('Company'),
  Config = mongoose.model('Config'),
  mail = require('../service/mail'),
  UUID = require('../kit/uuid');

exports.getComapnyBasicInfo = function(req, res) {
  Company.find(null,{'_id':1,'info.name':1,'login_email':1,'register_date':1,'status':1},function(err, companies) {
    if(err || !companies) {
      return res.send([]);
    } else {
      return res.send(companies);
    }
  })
};



exports.getCompanyDetail = function(req, res) {
  var _id = req.body._id;
  console.log(_id);
  Company.findOne({'_id': _id},{'info':1},function(err, company_info) {
    console.log(company_info);
    if(err || !company_info) {
      return res.send([]);
    } else {
      return res.send(company_info);
    }
  })
};


exports.getCompanyGroup = function(req, res) {

};





exports.validate = function(req, res) {
  var who = req.body.who,
      name = req.body.name,
      _id = req.body._id;
  Config.findOne({'name':'admin'}, function(err, config) {
    if(err || !config) {
      console.log(err);
      return res.send('ERR');
    } else {
      mail.sendCompanyActiveMail(who, name, _id, config.host.product);
      return res.send('ok');
    }
  });
};