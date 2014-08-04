'use strict';

var mongoose = require('mongoose'),
  Company = mongoose.model('Company'),
  User = mongoose.model('User');


exports.home = function (req ,res){
  res.render('system/user');
}

var companySelect = function(condition,res){
  Company.findOne(condition).exec(function (err,company){
    if(err || !company){
      return res.send({'msg':'COMPANY_FETCH_FAILED','result':0});
    }else{
      User.find({'cid':company._id},{'nickname':1,'cname':1,'role':1,'team':1,'active':1,'mail_active':1},function (err,users){
        if(err || !users){
          return res.send({'msg':'USER_FETCH_FAILED','result':0});
        }else{
          return res.send({'msg':'USER_FETCH_SUCCESS','result':1,'users':users});
        }
      });
    }
  });
}

exports.searchCompanyForUser = function (req ,res){
  //第一次默认取第一个公司的所有员工
  if(req.body._id == undefined || req.body._id == null){
    var condition = {'info.membernumber':{'$ne':0}};
    companySelect(condition,res);
  }else{
    var condition = {'_id':req.body._id};
    companySelect(condition,res);
  }
}

exports.userModify = function(req,res){
  User.update({'_id':req.body._id},{'$set':req.body.operate},function (err, user){
    if(err || !user){
      return res.send({'msg':'USER_UPDATE_ERROR','result':0});
    }else{
      return res.send({'msg':'USER_UPDATE_SUCCESS','result':1});
    }
  });
}