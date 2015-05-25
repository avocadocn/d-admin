'use strict';


// mongoose models
var mongoose = require('mongoose'),
  Config = mongoose.model('Config'),
  async = require('async'),
  CompanyRegisterInviteCode = mongoose.model('CompanyRegisterInviteCode'),
  Region = mongoose.model('Region'),
  Group = mongoose.model('Group'),
  Rank = mongoose.model('Rank'),
  CompanyGroup = mongoose.model('CompanyGroup');


exports.getCode = function(req,res){
  CompanyRegisterInviteCode
  .find().sort({'_id':-1})
  .exec(function(err, codes) {
    return res.send({result:1, codes: codes });
  });
}

exports.settingView = function(req, res) {
  CompanyRegisterInviteCode
  .find().sort({'_id':-1})
  .exec(function(err, codes) {
    res.render('system/setting', { codes: codes });
  });

};

exports.getCodeSwitch = function(req, res){
  Config.findOne({ name: 'admin' })
  .exec(function(err, config) {
    if(err || !config){
      return res.send({ result: 0, msg: '获取失败' });
    }else{
      if(config.company_register_need_invite != undefined && config.company_register_need_invite != null){
        return res.send({ result: 1, value: config.company_register_need_invite });
      }else{
        return res.send({ result: 0, msg: '获取失败' });
      }
    }
  });
}

exports.setNeedCompanyRegisterInviteCode = function(req, res) {
  var need = req.body.company_register_invite_code;
  console.log(typeof need,need);
  Config.findOne({ name: 'admin' })
  .exec(function(err, config) {
    config.company_register_need_invite = need;
    config.save(function(err) {
      if (err) {
        console.log(err);
        res.send({ result: 0, msg: '保存失败' });
      } else {
        res.send({ result: 1, msg: '保存成功', value:need });
      }
    });
  });
};

exports.createCompanyRegisterInviteCode = function(req, res) {
  var companyRegisterInviteCode = new CompanyRegisterInviteCode();
  companyRegisterInviteCode.save(function(err) {
    if (err) {
      return res.send({ result: 0, msg: '添加失败' });
    } else {
      exports.getCode(req,res);
    }
  });
};

var rankLimit = 10;
var rankUpdate = function(updateCallback) {
  var now = new Date();
  
  var updateTeamRank = function(region, city, group) {
    //虚拟组不计算
    if(group._id=="0"){
      //找出所有同类型的正常小队并进行排名
      return;
    }
    CompanyGroup.find({'active':true,'company_active':{'$ne':false},'city.province':region.name,'city.city': city.name,gid:group._id})
    .sort('-score_rank.score -score.total -score.win_percent -score.campaign -score.member')
    .exec(function (err,teams) {
      var rank = new Rank();
      rank.group_type ={
        _id:group._id,
        name:group.group_type
      }
      rank.city = {
        province: region.name,
        city: city.name
      }
      //将前十个放入rank里
      teams.forEach(function (team,index) {
        team.score_rank.rank = index+1;
        if(index<rankLimit){
          var competitionCount = team.score_rank.win + team.score_rank.tie + team.score_rank.lose;
          rank.team.push({
            _id: team._id,
            cid: team.cid,
            name: team.name,
            cname: team.cname,
            logo: team.logo,
            member_num: team.member.length,
            activity_score: team.score.total,
            score: team.score_rank.score,
            rank: index+1,
            win: team.score_rank.win,
            tie: team.score_rank.tie,
            lose: team.score_rank.lose
          });
        }
        team.save(function (err) {
          if(err){
            console.log(err)
          }
        })
      });

      if(rank.team.length>0){
        rank.save(function (err) {
          if(err){
            console.log(err)
          }
        })
      }
    });
  }

  async.waterfall([
    function(callback) {
      Group.find({active:true}).exec(callback);
    },
    function(groups, callback) {
      Region.find().exec(function (err,regions) {
        regions.forEach(function (region) {
          region.city.forEach(function (city){
            groups.forEach(function (group){
              updateTeamRank(region, city, group);
            });
          });
        })
      })
      callback(null, 'score');
    }
  ], function (err, result) {
    updateCallback();
  });
}

exports.rankUpdate = function(req, res) {
  rankUpdate(function() {
    return res.send({msg:'重新排行成功'});
  })
}