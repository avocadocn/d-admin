'use strict';

var mongoose = require('mongoose'),
  Company = mongoose.model('Company'),
  Campaign = mongoose.model('Campaign'),
  Config = mongoose.model('Config'),
  User = mongoose.model('User');


exports.home = function (req ,res){
  res.render('system/campaign');
}

var companySelect = function(condition,res){
  Company.findOne(condition).exec(function (err,company){
    if(err || !company){
      return res.send({'msg':'COMPANY_FETCH_FAILED','result':0});
    }else{
      Campaign.find({'cid':company._id,'gid':{'$ne':'0'}},function (err,campaigns){
        if(err || !campaigns){
          return res.send({'msg':'CAMPAIGN_FETCH_FAILED','result':0});
        }else{
          Config.findOne({'name':'admin'},{'host':1},function (err,config){
            if(err || !config){
              return res.send({'msg':'CAMPAIGN_FETCH_SUCCESS','result':0,'campaigns':campaigns});
            }else{
              return res.send({'msg':'CAMPAIGN_FETCH_SUCCESS','result':1,'campaigns':campaigns,'host':config.host.product});
            }
          });
        }
      });
    }
  });
}


var teamHandle = function(teams){
  var team_by_group = [];
  var find = false;
  for(var i =0; i < teams.length; i ++){
    for(var j = 0 ; j < team_by_group.length; j ++){
      //如果已经存在分组就把小队push进去
      if(team_by_group[j].gid === teams[i].gid){
        find = true;
        team_by_group[j].teams.push(teams[i]);
      }
    }
    //新建分组
    if(!find){
      team_by_group.push({
        'group_type':teams[i].group_type,
        'gid':teams[i].gid,
        'teams':[teams[i]]
      });
    }
    find = false;
  }
  return team_by_group;
}
exports.searchCompanyForTeam = function (req ,res){
  //第一次默认取第一个公司的所有小队
  if(req.body._id == undefined || req.body._id == null){
    var condition = {'team':{'$ne':[]}};
    companySelect(condition,res,null);
  }else{
    var condition = {'_id':req.body._id};
    companySelect(condition,res,null);
  }
}

//按地区取小组
exports.getTeamByGroup = function(req,res){
 
}