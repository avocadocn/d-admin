'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Company = mongoose.model('Company'),
    CompanyGroup = mongoose.model('CompanyGroup'),
    Department = mongoose.model('Department');



exports.updateCompanyName = function (cname,cid) {
  User.update({'cid':cid},{'$set':{'cname':cname}},{'multi':true},function (err,users){
    if(err || !users){
      console.log({'msg':'SYNC_CNAME_FOR_USER_FAILED','err':err});
    }
  });
  CompanyGroup.update({'cid':cid},{'$set':{'cname':cname}},{'multi':true},function (err,teams){
    if(err || !teams){
      console.log({'msg':'SYNC_CNAME_FOR_TEAM_FAILED','err':err});
    }
  });
  Department.update({'company._id':cid},{'$set':{'company.name':cname}},{'multi':true},function (err,departments){
    if(err || !departments){
      console.log({'msg':'SYNC_CNAME_FOR_DEPARTMENT_FAILED','err':err});
    }
  });
}