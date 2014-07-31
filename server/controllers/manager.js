'use strict';

var mongoose = require('mongoose'),
  Company = mongoose.model('Company'),
  Config = mongoose.model('Config'),
  mail = require('../service/mail'),
  UUID = require('../kit/uuid');

exports.getComapnyBasicInfo = function(req, res) {
  Company.find(null,{'_id':1,'info.name':1,'info.membernumber':1,'department':1,'team':1,'login_email':1,'register_date':1,'status':1}).sort({'register_date':-1}).exec(function(err, companies) {
    if(err || !companies) {
      return res.send([]);
    } else {
      companies.forEach(function(company){
        company.set('department_num',countDepartment(company.department,0),{strict : false});
      });
      return res.send(companies);
    }
  })
};

function countDepartment(p_department,num) { //p_department为数组
  if(p_department){//非空
    for(var j=0;j<p_department.length;j++){//遍历p_department
      if(p_department[j].department){//如果p_department[j]有子department
        num = countDepartment(p_department[j].department,num);//递归查询到最底
      }
    }
    num+=p_department.length;//先加最底层的数组长度
  }
  return num;
}


exports.getCompanyDetail = function(req, res) {
  var _id = req.body._id;
  Company.findOne({'_id': _id},{'info':1,'register_date':1,'login_email':1},function(err, company_info) {
    if(err || !company_info) {
      return res.send([]);
    } else {
      return res.send(company_info);
    }
  })
};


exports.getCompanyGroup = function(req, res) {

};


exports.home = function(req,res){
  res.render('system/manager');
}


exports.validate = function(req, res) {
  var who = req.body.who,
      name = req.body.name,
      _id = req.body._id;
  //console.log(who,name,_id,req.headers.host);
  //mail.sendCompanyActiveMail(who, name, _id, req.header.host);
  Company.update({'_id':_id},{'$set':{'status.date':new Date().getTime()}},function (err, company){
    if(err || !company){
      return res.send({'msg':'COMPANY_FETCH_FAILUTRE!','result':0});
    }else{
      Config.findOne({'name':'admin'}, function(err, config) {
        if(err || !config) {
          console.log(err);
          return res.send({'msg':'MAIL_SEND_FAILUTRE!','result':0});
        } else {
          mail.sendCompanyActiveMail(who, name, _id, config.host.product);
          return res.send({'msg':'MAIL_SEND_SUCCESS!','result':1});
        }
      });
    }
  });
};