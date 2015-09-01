'use strict';

var mongoose = require('mongoose'),
  Company = mongoose.model('Company'),
  Team = mongoose.model('Team'),
  Config = mongoose.model('Config');

var companySelect = function(condition,res,callback){
  Company.findOne(condition).exec(function (err,company){
    if(err || !company){
      return res.send({'msg':'COMPANY_FETCH_FAILED','result':0});
    }else{
      Team.find({'cid':company._id},{'name':1,'member':1,'leader':1,'createTime':1,'logo':1,'cname':1,'score':1,'active':1},function (err,teams){
        if(err || !teams){
          return res.send({'msg':'TEAM_FETCH_FAILED','result':0});
        }else{
          Config.findOne({'name':'admin'},{'host':1},function (err,config){
            if(err || !config){
              return res.send({'msg':'TEAM_FETCH_SUCCESS','result':0,'teams':teams});
            }else{
              if(callback){
                return res.send({'msg':'TEAM_GROUPBY_SUCCESS','result':1,'team_by_group':callback(teams)});
              }else{
                return res.send({'msg':'TEAM_FETCH_SUCCESS','result':1,'teams':teams,'host':config.host.product});
              }
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
  var condition = {'_id':req.params.companyId};
  companySelect(condition,res);
}

//按类型取小组
//之所以直接查询CompanyGroup而不是从Company里查询小组的数量是因为以后会有更加复杂的统计需求
//目前只是按照小组类型统计小组数量
exports.getTeamByGroup = function(req,res){
  if(req.body.all){
    CompanyGroup.find({'gid':{'$ne':'0'}},{'name':1,'gid':1,'group_type':1,'_id':1,'member':1,'leader':1,'create_time':1,'home_court':1,'logo':1,'cname':1,'score':1},function (err,teams){
      if(err || !teams){
        return res.send({'msg':'TEAM_FETCH_FAILED','result':0});
      }else{
        Config.findOne({'name':'admin'},{'host':1},function (err,config){
          if(err || !config){
            return res.send({'msg':'TEAM_FETCH_SUCCESS','result':0,'teams':teams});
          }else{
            var team_by_group = teamHandle(teams);
            return res.send({'msg':'TEAM_GROUPBY_SUCCESS','result':1,'team_by_group':team_by_group,'host':config.host.product});
          }
        });
      }
    });
  }else{
    companySelect({'_id':req.body.cid},res,teamHandle);
  }
}

exports.teamAddCity = function(req,res){
  CompanyGroup.find().populate('cid').exec().then(function(teams){
    async.map(teams,function(team,callback){
      team.city = team.cid.info.city;
      team.save(function(err) {
        if(err){
          callback(err);
        }
        else
          callback();
      });
    },function(err,result){
      if(err){
        console.log(err);
        return res.send({'result':0,'msg':'查询错误'});
      }else{
        return res.send({'result':1,'msg':'增加城市属性成功'});
      }
    });
  })
  .then(null,function(err) {
    console.log(err);
    return res.send({result:0,msg:'查询错误'});
  });
}
exports.getTeam = function(req,res){
  Team.findOne({'_id':req.params.teamId},{'member':1,'leader':1,'cname':1,'group_type':1})
  .populate({
    path: "member._id",
    select: 'nickname realname'
  })
  .exec()
  .then(function (team){
    if(!team){
      return res.status(400).send({'msg':'该小队不存在'});
    }else{
      team = team.toObject();
      team.member.forEach(function(value){
        for(var i = 0; team.leader && i < team.leader.length; i ++){
          if(value._id._id.toString() === team.leader[i].toString()){
            value._id.leader = true;
            return;
          }
        }
        for(var i = 0; team.administrators && i < team.administrators.length; i ++){
          if(value._id._id.toString() === team.administrators[i].toString()){
            value._id.admin = true;
            break;
          }
        }
      });
      return res.send(team);
    }
  })
  .then(null,function(err) {
    console.log(err)
    return res.status(500).send({'msg':'获取小队错误'});
  })
}