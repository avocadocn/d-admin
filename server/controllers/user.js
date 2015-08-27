'use strict';

var mongoose = require('mongoose'),
  CompanyGroup = mongoose.model('CompanyGroup'),
  Company = mongoose.model('Company'),
  User = mongoose.model('User');

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

var updateCompanyAdmin = function(user, role, callback) {
  console.log(user);
  var operation = {};
  switch (role) {
    case 'SuperAdmin':
      operation = {'$addToSet': {'super_admin':user._id}};
      break;
    case 'Student':
      operation = {'$pull': {'super_admin':user._id}};
      break;
    default:
      return callback('参数错误');
  }
  Company.update({'_id':user.cid}, operation, function(err, company) {
    if(err || !company) {
      console.log(err);
      callback('err');
    }
    else {
      callback();
    }
  })
};
/**
 * 指定/取消大使资格
 * @param  {object} req:
 *           {
 *             role: string
 *           }
 */
exports.pointAdmin = function(req, res) {
  var role = req.body.role;
  var userId = req.params.userId;
  User.findOneAndUpdate({'_id': userId}, {'$set':{'role': role}}, function(err, user) {
    if(err || !user) {
      return res.status(500).send({'msg': '指定失败'})
    }
    else {
      updateCompanyAdmin(user, role, function(err) {
        if(err) {
          return res.status(500).send({'msg': '指定失败'})
        }
        else {
          return res.status(200).send({'msg': '指定成功'})
        }
      })
    }
  })
};

exports.getCompanyUser = function(req, res) {
  User.find({'cid': req.params.companyId}, {'_id':1, 'photo':1, 'nickname':1, 'phone':1, 'realname':1, 'role':1},
  function(err, users) {
    if(err) {
      console.log(err);
      res.status(500).send({msg:'查询错误'});
    }
    else {
      res.status(200).send(users);
    }
  })
};
