'use strict';

var mongoose = require('mongoose'),
    Company = mongoose.model('Company'),
    CompanyGroup = mongoose.model('CompanyGroup'),
    User = mongoose.model('User'),
    easemob = require('./easemob.js'),
    async = require('async');
var getMemberId = function (member) {
  return member._id;
}
var getMember = function (member) {
  return {username:member._id, password:member._id};
}
var getGroup= function (group) {
  var groupMembers = group.member.map(getMemberId)
  return  {
            "groupname":group.id,
            "desc":group.name,
            "public":true,
            "owner":group.cid,
            "members":groupMembers
          };
}
exports.resetToken = easemob.resetToken;
exports.addUsers = function (callback) {
  var pageSize = 10;
  var nowResultLength = 0;
  var totalCount = 0, successCount = 0, failedCount = 0;
  var nextQueryId;
  var registerUser = function (users, doWhilstCallback) {
    var _members = users.map(getMember);
    easemob.user.create(_members,function (error,data) {
      if(error){
        console.log(error);
        failedCount +=_members.length;
      }
      else{
        successCount +=_members.length;
      }
      doWhilstCallback();
    });
  };
  async.doWhilst(function (doWhilstCallback) {
    var query = {mail_active:true};
    if (nextQueryId) {
      query._id = {
        $gt: nextQueryId
      };
    }
    User.find(query)
      .sort('_id')
      .limit(pageSize)
      .exec()
      .then(function (users) {
        if (users.length > 0) {
          nextQueryId = users[users.length - 1]._id;
          nowResultLength = users.length;
          totalCount += users.length;
        }
        registerUser(users,doWhilstCallback);
      })
      .then(null, function (err) {
        console.log('查找用户出错:', err);
        console.log(err.stack);
        doWhilstCallback();
      });

  }, function () {
    return nowResultLength === pageSize;
  }, function (err) {
    if(callback){
      callback({totalCount:totalCount, successCount: successCount, failedCount: failedCount});
    }
    console.log('[注册环信用户]注册数:', totalCount, '成功:', successCount, '失败:', failedCount);
  });
}
exports.addHrUsers = function (callback) {
  var pageSize = 20;
  var nowResultLength = 0;
  var totalCount = 0, successCount = 0, failedCount = 0;
  var nextQueryId;
  var registerUser = function (users, doWhilstCallback) {
    var _members = users.map(getMember);
    easemob.user.create(_members,function (error,data) {
      if(error){
        console.log(error);
        failedCount +=_members.length;
      }
      else{
        successCount +=_members.length;
      }
      doWhilstCallback();
    });
  };
  async.doWhilst(function (doWhilstCallback) {
    var query = {"status.mail_active":true};
    if (nextQueryId) {
      query._id = {
        $gt: nextQueryId
      };
    }
    Company.find(query)
      .sort('_id')
      .limit(pageSize)
      .exec()
      .then(function (companies) {
        if (companies.length > 0) {
          nextQueryId = companies[companies.length - 1]._id;
          nowResultLength = companies.length;
          totalCount += companies.length;
        }
        registerUser(companies,doWhilstCallback);
      })
      .then(null, function (err) {
        console.log('查找hr用户出错:', err);
        console.log(err.stack);
        doWhilstCallback();
      });

  }, function () {
    return nowResultLength === pageSize;
  }, function (err) {
    if(callback){
      callback({totalCount:totalCount, successCount: successCount, failedCount: failedCount});
    }
    console.log('[注册环信Hr用户]注册数:', totalCount, '成功:', successCount, '失败:', failedCount);
  });
}
exports.addGroups = function (callback) {
  var pageSize = 20;
  var nowResultLength = 0;
  var totalCount = 0, successCount = 0, failedCount = 0;
  var nextQueryId;
  var registerGroups = function (groups, doWhilstCallback) {
    async.each(groups, function(group, cb) {
      var _group = getGroup(group);
      easemob.group.add(_group,function (error,data) {
        if(error){
          console.log(error);
          failedCount ++;
        }
        else{
          successCount ++;
          group.easemobId = data.data.groupid;
          group.save(function (error) {
            if(error) log(error);
          });
        }
        cb(error);
      });
    }, function(err) {
      doWhilstCallback();
    });

  };
  async.doWhilst(function (doWhilstCallback) {
    var query = {"active":true};
    if (nextQueryId) {
      query._id = {
        $gt: nextQueryId
      };
    }
    CompanyGroup.find(query)
      .sort('_id')
      .limit(pageSize)
      .exec()
      .then(function (teams) {
        if (teams.length > 0) {
          nextQueryId = teams[teams.length - 1]._id;
          nowResultLength = teams.length;
          totalCount += teams.length;
          registerGroups(teams,doWhilstCallback);
        }
        else{
          nowResultLength=0;
          doWhilstCallback();
        }
      })
      .then(null, function (err) {
        console.log('查找小队出错:', err);
        console.log(err.stack);
        doWhilstCallback();
      });

  }, function () {
    return nowResultLength === pageSize;
  }, function (err) {
    if(callback){
      callback({totalCount:totalCount, successCount: successCount, failedCount: failedCount});
    }
    console.log('[注册环信群组]注册数:', totalCount, '成功:', successCount, '失败:', failedCount);
  });
}