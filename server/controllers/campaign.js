'use strict';

var mongoose = require('mongoose'),
  Company = mongoose.model('Company'),
  Campaign = mongoose.model('Campaign'),
  Config = mongoose.model('Config'),
  User = mongoose.model('User');

//总分类: 1,2,3,6,8是活动  4,5,7,9是挑战
//type:活动类型
//1:公司活动
//2:小队活动
//3:公司内跨组活动（性质和小队活动一样,只是参加活动的小队不止一个而已,这些小队都是一个公司的）
//4:公司内挑战（同类型小组）
//5:公司外挑战（同类型小组）
//6:部门内活动 (一个部门的活动)
//7:动一下 (一个小队向另一个小队发起挑战,这两个小队不分类型也不分公司)
//8:部门间活动 (公司的两个部门一起搞活动)
//9:部门间相互挑战

exports.home = function (req ,res){
  res.render('system/campaign');
}

var companySelect = function(condition,res){
  Company.findOne(condition,{'_id':1,'info.name':1}).exec(function (err,company){
    if(err || !company){
      return res.send({'msg':'COMPANY_FETCH_FAILED','result':0});
    }else{
      Campaign.find({'cid':company._id,'gid':{'$ne':'0'}}).populate('team').sort({'start_time':-1}).exec(function (err,campaigns){
        if(err || !campaigns){
          return res.send({'msg':'CAMPAIGN_FETCH_FAILED','result':0});
        }else{
          for(var i = 0 ; i < campaigns.length ; i ++){
            switch(campaigns[i].campaign_type){
              case 1:
                campaigns[i].set('type','公司',{'strict':false});
              break;
              case 2:
                campaigns[i].set('type',campaigns[i].team[0].group_type,{'strict':false});
              break;
              case 6:
                campaigns[i].set('type','部门',{'strict':false});
              break;
              default:
                campaigns[i].set('type','混合',{'strict':false});
              break;
            }
          }
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
  Campaign.find({'team':req.body.teamId}).populate('team').sort({'start_time':-1}).exec(function (err,campaigns){
    if(err || !campaigns){
      return res.send({'msg':'TEAM_CAMPAIGN_FETCH_FAILED','result':0});
    }else{
      return res.send({'msg':'TEAM_CAMPAIGN_FETCH_SUCCESS','result':1,'campaigns':campaigns});
    }
  });
}