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
                campaigns[i].set('group_type','公司',{'strict':false});
              break;
              case 2:
                campaigns[i].set('group_type',campaigns[i].team[0].group_type,{'strict':false});
              break;
              case 6:
                campaigns[i].set('group_type','部门',{'strict':false});
              break;
              default:
                campaigns[i].set('group_type','混合',{'strict':false});
              break;
            }
            campaigns[i].set('campaign_type_value',filter(campaigns[i].campaign_type),{'strict':false});
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

var filter = function(type){
  switch(type){
    case 1:
      return '公司';
    break;
    case 2:
      return '小队内部';
    break;
    case 3:
      return '公司内跨组活动';
    break;
    case 4:
      return '公司内比赛';
    break;
    case 5:
      return '公司外比赛';
    break;
    case 6:
      return '部门内部';
    break;
    case 7:
      return '随意挑战';
    break;
    default:
      return '其它';
    break;
  }
}

var campaignHandle = function(campaigns){
  var campaign_by_group = []; //按标签分
  var campaign_by_type = [];  //按类型分
  var find_group = false;
  var find_type = false;
  for(var i =0; i < campaigns.length; i ++){
    for(var j = 0 ; j < campaign_by_group.length; j ++){
      //如果已经存在分组就把活动push进去
      switch(campaigns[i].campaign_type){
        case 1:
          if(campaign_by_group[j].group_type === '公司'){
            find_group = true;
            campaign_by_group[j].campaigns.push(campaigns[i].theme);
          }
        break;
        case 2:
          if(campaign_by_group[j].group_type === campaigns[i].team[0].group_type){
            find_group = true;
            campaign_by_group[j].campaigns.push(campaigns[i].theme);
          }
        break;
        case 6:
          if(campaign_by_group[j].group_type === '部门'){
            find_group = true;
            campaign_by_group[j].campaigns.push(campaigns[i].theme);
          }
        break;
        default:
          if(campaign_by_group[j].group_type === '混合'){
            find_group = true;
            campaign_by_group[j].campaigns.push(campaigns[i].theme);
          }
        break;
      }
    }

    for(var k = 0; k < campaign_by_type.length ; k ++){
      if(campaign_by_type[k].typeId === campaigns[i].campaign_type){
        find_type = true;
        campaign_by_type[k].campaigns.push(campaigns[i].theme);
      }
    }
    //新建分组
    if(!find_group){
      switch(campaigns[i].campaign_type){
        case 1:
          campaign_by_group.push({
            'group_type':'公司',
            'campaigns':[campaigns[i].theme]
          });
        break;
        case 2:
          campaign_by_group.push({
            'group_type':campaigns[i].team[0].group_type,
            'campaigns':[campaigns[i].theme]
          });
        break;
        case 6:
          campaign_by_group.push({
            'group_type':'部门',
            'campaigns':[campaigns[i].theme]
          });
        break;
        default:
          campaign_by_group.push({
            'group_type':'混合',
            'campaigns':[campaigns[i].theme]
          });
        break;
      }
    }
    //新建分组
    if(!find_type){
      campaign_by_type.push({
        'type':filter(campaigns[i].campaign_type),
        'typeId':campaigns[i].campaign_type,
        'campaigns':[campaigns[i].theme]
      });
    }
    find_group = false;
    find_type = false;
  }
  return [campaign_by_group,campaign_by_type];
}

var byRule = function(cid,res){
  var condition;
  if(cid){
    condition = {'cid':cid};
  }else{
    condition = null;
  }
  Campaign.find(condition).populate('team').exec(function (err,campaigns){
    if(err || !campaigns){
      res.send({'result':0,'msg':'TYPE_CAMPAIGN_FETCH_FAILED','campaigns':[]});
    }else{
      var rst = campaignHandle(campaigns);
      res.send({'result':1,'msg':'TYPE_CAMPAIGN_FETCH_SUCCESS','campaign_by_group':rst[0],'campaign_by_type':rst[1]});
    }
  });
}

exports.campaignByRule = function(req,res){
  var cid = req.body.cid;
  byRule(cid,res);
}