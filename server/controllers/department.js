'use strict';

var mongoose = require('mongoose'),
  Company = mongoose.model('Company'),
  Department = mongoose.model('Department'),
  CompanyGroup = mongoose.model('CompanyGroup'),
  Config = mongoose.model('Config'),
  User = mongoose.model('User');

exports.home = function (req ,res){
  res.render('system/department');
}

var companySelect = function(condition,res){
  Company.findOne(condition).exec(function (err,company){
    if(err || !company){
      return res.send({'msg':'COMPANY_FETCH_FAILED','result':0});
    }else{
      Department.find({'company':company._id},function (err,departments){
        if(err || !departments){
          return res.send({'msg':'DEPARTMENT_FETCH_FAILED','result':0});
        }else{
          Config.findOne({'name':'admin'},{'host':1},function (err,config){
            if(err || !config){
              return res.send({'msg':'CONFIG_FETCH_SUCCESS','result':0,'departments':departments});
            }else{
              return res.send({'msg':'DEPARTMENT_FETCH_SUCCESS','result':1,'departments':departments,'host':config.host.product});
            }
          });
        }
      });
    }
  });
}

exports.searchCompanyForDepartment = function (req ,res){
  //第一次默认取第一个公司的所有小队
  if(req.body._id == undefined || req.body._id == null){
    var condition = {'department':{'$ne':null}};
    companySelect(condition,res,null);
  }else{
    var condition = {'_id':req.body._id};
    companySelect(condition,res,null);
  }
}