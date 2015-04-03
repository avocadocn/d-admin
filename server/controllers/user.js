'use strict';

var mongoose = require('mongoose'),
  CompanyGroup = mongoose.model('CompanyGroup'),
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
      User.find({'cid':company._id},{'nickname':1,'cname':1,'role':1,'team':1,'disabled':1,'mail_active':1,'_id':1, 'invite_person': 1},function (err,users){
        if(err || !users){
          return res.send({'msg':'USER_FETCH_FAILED','result':0});
        }else{
          // 转换为简单对象，以解除mongoose文档的约束，便于修改属性写入响应
          var docToObject = function(doc) {
            return doc.toObject();
          };

          var usersDoc = users.map(docToObject);

          var invitePersonToObj = function(obj) {
            if(obj.invite_person == undefined || obj.invite_person == null) {
              return;
            }
            for(var i = 0, usersLen = usersDoc.length; i < usersLen; i++) {
              if(obj.invite_person.toString() == usersDoc[i]._id.toString()) {
                obj.invite_person = usersDoc[i].nickname;
                break;
              }
            }
          }

          usersDoc.forEach(function(user) {
            invitePersonToObj(user);
          });

          return res.send({'msg':'USER_FETCH_SUCCESS','result':1,'users':usersDoc});
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


exports.userByTeam = function(req,res){
  CompanyGroup.findOne({'_id':req.body.teamId},{'member':1,'leader':1,'cname':1,'group_type':1},function (err,team){
    if(err || !team){
      return res.send({'msg':'TEAM_USER_FETCH_ERROR','result':0});
    }else{
      team.member.forEach(function(value){
        var leader = false;
        for(var i = 0; i < team.leader.length; i ++){
          if(value._id.toString() === team.leader[i]._id.toString()){
            leader = true;
            break;
          }
        }
        value.set('leader', leader, {strict : false});
        value.set('cname', team.cname, {strict : false});
      });
      return res.send({'msg':'TEAM_USER_FETCH_SUCCESS','result':1, 'team':team});
    }
  })
}

exports.tolower = function(req,res) {
  User.find(null,{'username':1,'email':1})
  .exec()
  .then(function(users){
    users.forEach(function(user){
        user.username = user.username.toLowerCase();
        user.save(function(err){
          if(err)
            console.log(err);
          // else
          //   console.log(user);
        })
    });
    return res.send({});
  })
  .then(null,function(err){
    console.log(err);
    return res.send(500);
  })
}