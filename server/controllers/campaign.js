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
  Company.findOne(condition,{'_id':1,'info.name':1}).exec(function (err,company){
    if(err || !company){
      return res.send({'msg':'COMPANY_FETCH_FAILED','result':0});
    }else{
      Campaign.find({'cid':company._id,'gid':{'$ne':'0'}},function (err,campaigns){
        if(err || !campaigns){
          return res.send({'msg':'CAMPAIGN_FETCH_FAILED','result':0});
        }else{
          Config.findOne({'name':'admin'},{'host':1},function (err,config){
            if(err || !config){
              return res.send({'msg':'CAMPAIGN_FETCH_SUCCESS','result':0,'campaigns':campaigns,'company':{'_id':company._id,'name':company.info.name}});
            }else{
              return res.send({'msg':'CAMPAIGN_FETCH_SUCCESS','result':1,'campaigns':campaigns,'host':config.host.product,'company':{'_id':company._id,'name':company.info.name}});
            }
          });
        }
      });
    }
  });
}

exports.searchCompanyForCampaign = function (req ,res){
  //第一次默认取第一个公司的所有活动
  if(req.body._id == undefined || req.body._id == null){
    var condition = {'team':{'$ne':[]}};
    companySelect(condition,res,null);
  }else{
    var condition = {'_id':req.body._id};
    companySelect(condition,res,null);
  }
}

exports.campaignByTeam = function(req,res){
  Campaign.find({'team':req.body.teamId}).sort({'start_time':-1}).exec(function (err,campaigns){
    if(err || !campaigns){
      return res.send({'msg':'TEAM_CAMPAIGN_FETCH_FAILED','result':0});
    }else{
      return res.send({'msg':'TEAM_CAMPAIGN_FETCH_SUCCESS','result':1,'campaigns':campaigns});
    }
  });
}