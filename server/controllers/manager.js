'use strict';

var mongoose = require('mongoose'),
  Company = mongoose.model('Company'),
  UUID = require('../kit/uuid');

exports.getComapnyBasicInfo = function(req, res) {
  Company.find(null,{'id':1,'info.name':1,'login_email':1,'register_date':1,'status':1},function(err, companies) {
    if(err || !companies) {
      return res.send([]);
    } else {
      return res.send(companies);
    }
  })
};



exports.getCompanyDetail = function(req, res) {
  var id = req.body.cid;
  Company.findOne({'id':id},{'info':1},function(err, company_info) {
    if(err || !company_info) {
      return res.send([]);
    } else {
      return res.send(company_info);
    }
  })
};


exports.getCompanyGroup = function(req, res) {

};