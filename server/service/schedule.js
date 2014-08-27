'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Company = mongoose.model('Company'),
    CompanyGroup = mongoose.model('CompanyGroup'),
    Campaign = mongoose.model('Campaign'),
    Push = require('../controllers/push'),
    async = require('async'),
    schedule = require('node-schedule');

var _push = function(){
  var start = new Date();
  var start_point = new Date(start.getTime() + 3600 * 1000);
  var condition = {'$and':[{'start_time':{'$gte':new Date()}},{'start_time':{'$lte':start_point}}]};
  Campaign.find(condition,{'campaign_id':1,'campaign_type':1,'theme':1,'content':1,'start_time':1,'end_time':1},function(err,campaigns){
    if(err || !campaigns){
      console.log(err,campaigns);
    }
    else{
      console.log(campaigns.length);
      var counter = {
        i:0
      }
      var sum = campaigns.length;
      async.whilst(
        function() { return counter.i < sum},
        function(__callback){
          var msg = {
            body:campaigns[counter.i].theme,
            description:campaigns[counter.i].theme,
            title:'您有一个活动即将开始!'
          }
          Push.pushCampaign(campaigns[counter.i].members,msg,counter,__callback);
        },
        function(err){
          if(err){
            console.log({'result':0,'msg':'SCHEDULE_FAILURED'});
          }else{
            console.log({'result':1,'msg':'SCHEDULE_SUCCESS'});
          }
        }
      );
    }
  });
}



exports.init = function(){
  var rule = new schedule.RecurrenceRule();
  //rule.hour = 8;
  rule.minute = 16;
  var j = schedule.scheduleJob(rule, function(){
      _push();
  });
}