//推送的具体操作
var mongoose = require('mongoose'),
    PushAndroid = require('../service/pushServiceAndroid'),
    PushIOS = require('../service/pushServiceIOS'),
    secret = require('../config/secret'),
    encrypt = require('../kit/encrypt'),
    rootConfig = require('../config/config'),
    async = require('async'),
    User = mongoose.model('User');

var optionsAndroid = {
   ak: 'pSGg3PHKgD7vdah7eHDydQOu',
   sk: 'pcMcc3WnqQCPNi4GY4xXPXrBanNizo1z'
};

// var optionsAndroid = {
//    ak: 'C8aqWRQiPFlpcKsuL3Iru7d6',
//    sk: 'nyPPYGqDmybQcQyQlOeehLUZAXegfciP'
// };

var optionsIOS = {
  gateway: 'gateway.sandbox.push.apple.com',
  cert: rootConfig.root+'/server/service/PushChatCert.pem',
  key:  rootConfig.root+'/server/service/PushChatKey.pem',
  passphrase: '55yali',
  port: 2195,
  enhanced: true,
  cacheLength: 100
};

var IOSfeedbackOptions = {
  gateway: 'feedback.sandbox.push.apple.com',
  cert: rootConfig.root+'/server/service/PushChatCert.pem',
  key:  rootConfig.root+'/server/service/PushChatKey.pem',
  passphrase: '55yali',
  interval: 60, // 60秒请求一次推送结果
  port: 2196
};

var clientIOS = PushIOS.CreateService(optionsIOS);
var iosFeedbackService = PushIOS.CreateFeedback(IOSfeedbackOptions, function (feedbackData) {
  var time, device;
  for (var i in feedbackData) {
    time = feedbackData[i].time;
    device = feedbackData[i].device;
    console.log("Device: " + device.toString('hex') + " has been unreachable, since: " + time);
  }
}, console.log);


var clientAndroid = new PushAndroid(optionsAndroid);

// 注：以下注释代码已经不能工作，仅仅是为了做安卓的推送时方便参考，一旦完成安卓的推送，应该删去这段代码
//
// var _push = function(users,msg,out_callback){
//   var user_id_or_tokens = [];
//   //第一步:获取参加活动的所有成员,取出他们的设备推送码(token或者user_id)
//   for(var i = 0 ; i < users.length; i ++){
//     if(!users[i].push_toggle&&users[i].device){
//       for(var j = 0; j < users[i].device.length; j ++){
//         if(users[i].device[j].platform == 'Android'){
//           user_id_or_tokens.push({
//             'platform':'Android',
//             '_id':users[i]._id,
//             'nickname':users[i].nickname,
//             'target':users[i].device[j].user_id
//           });
//           //第一次初始化
//           if(!clientAndroid){
//             clientAndroid = new PushAndroid(optionsAndroid);
//           }
//         }
//         if(users[i].device[j].platform == 'iOS'){

//           user_id_or_tokens.push({
//             'platform':'iOS',
//             '_id':users[i]._id,
//             'nickname':users[i].nickname,
//             'target':users[i].device[j].token
//           });
//           //第一次初始化
//           if(!clientIOS){
//             cilentIOS = new PushIOS(optionsIOS);
//           }
//         }
//       }
//     }
//   }

//   if(user_id_or_tokens.length > 0){
//     //第二步:分别定义IOS和Android的推送信息头

//     // var body = {
//     //   'application':optionsIOS.application,
//     //   'auth':null,
//     //   'notifications':{
//     //     'send_date':new Date(),
//     //     'content':msg.body,
//     //     'data':{
//     //       'custom':'json data'
//     //     },
//     //     'link':optionsIOS.link
//     //   }
//     // }

//     var body = {
//       'alert':{'body':msg.body},
//       'playload':{'messageFrom':'Donler'},
//       'token':null
//     }

//     var opt = {
//       message_type:1,
//       push_type: 1,
//       user_id: null,
//       messages: JSON.stringify({'title':msg.title,'description':msg.description}),
//       msg_keys: 'nick667'
//     }

//     //console.log(msg.description);

//     // //第三步:依次同步推送给所有成员的所有设备
//     // var callback = function(data,counter,__callback){
//     //   counter.i++;
//     //   __callback();
//     //   console.log(data);
//     // }
//     // var counter = {
//     //   i:0
//     // };
//     // var sum = user_id_or_tokens.length;
//     // async.whilst(
//     //   function() { return counter.i < sum},
//     //   function(__callback){
//     //     if(user_id_or_tokens[counter.i].platform == 'iOS'){
//     //       body.token = user_id_or_tokens[counter.i].target;
//     //       cilentIOS.pushMsg(body,out_callback,counter,__callback);
//     //     }
//     //     if(user_id_or_tokens[counter.i].platform == 'Android'){
//     //       opt.user_id = user_id_or_tokens[counter.i].target;
//     //       clientAndroid.pushMsg(opt, function(err, result) {
//     //         if (err) {
//     //           console.log(err);
//     //           callback({'msg':'CAMPAIGN_PUSH_ERROR','result':0,'data':result},counter,__callback);
//     //         }else{
//     //           callback({'msg':'CAMPAIGN_PUSH_SUCCESS','result':1,'data':result},counter,__callback);
//     //         }
//     //       })
//     //     }
//     //   },
//     //   function(err){
//     //     var value;
//     //     if(err){
//     //       value = ({'result':0,'msg':'PUSH_FAILURED'});
//     //     }else{
//     //       value = ({'result':1,'msg':'PUSH_SUCCESS'});
//     //     }
//     //     if(out_callback){
//     //       out_callback(value);
//     //     }
//     //   }
//     // );

//     async.map(user_id_or_tokens, function(user_id_or_token, callback) {
//       if(user_id_or_token.platform == 'iOS'){
//         body.token = user_id_or_token.target;
//         // TO DO: 暂不改动clientIOS，先省略后几个参数，不可把out_callback传入
//         cilentIOS.pushMsg(body, function(result) {
//           console.log(result);
//         });
//       } else if(user_id_or_token.platform == 'Android'){
//         opt.user_id = user_id_or_token.target;
//         clientAndroid.pushMsg(opt, function(err, result) {
//           if (err) {
//             console.log(err);
//           }
//         });
//       }

//       // 无论成功与否，只要执行过pushMsg就视为推送任务结束，结果另行处理
//       callback(null, user_id_or_token);
//     }, function(err, result) {
//       out_callback({'result':1,'msg':'PUSH_OVER'});
//     })


//   }else{
//     if(out_callback){
//       out_callback({'result':1,'msg':'PUSH_OVER'});
//     }
//   }
// }
// //自动判断用户手机平台,推送对应格式的消息
// exports.pushCampaign = function(req,res){
//   var members = eval('('+req.body.members+')');
//   var msg = {
//     title : req.body.title,
//     body: req.body.body,
//     description: req.body.description
//   }

//   var key = eval('('+req.body.key+')');
//   if(key.campaign_id_key == encrypt.encrypt(key.campaign_id,secret.SECRET)){
//     //生产模式
//     var uids = [];
//     if(members){
//       for(var i = 0; i < members.length; i ++){
//         uids.push(members[i]._id);
//       }

//       User.find({'_id':{'$in':uids}},{'_id':1,'device':1,'push_toggle':1},function(err,users){
//         if(err || !users){
//           return res.send({'msg':'USER_NOT_FOUND','result':0});
//         }else{
//           var msg = {
//             body:req.body.body,
//             title:req.body.title,
//             description:req.body.description
//           }
//           _push(users,msg,function(data){return res.send(data);});
//         }
//       });
//     }else{
//       return res.send({'msg':'NO_USER','result':1});
//     }

//     // 测试模式
//     // var users = [{
//     //   '_id':'0',
//     //   'nickname':'a',
//     //   'device':[{
//     //     'platform':'Android',
//     //     'user_id':'1125800188872535509'
//     //   }]},{
//     //   '_id':'1',
//     //   'nickname':'b',
//     //   'device':[{
//     //     'platform':'IOS',
//     //     'token':'77743b58fdad19fe55565b31ad8eb8b457bd55d90ca56f45c7de5cd2f7bda073'
//     //   }]
//     // }
//     // ];
//     // var ballback = function(data){
//     //   return res.send(data);
//     // };
//     //console.log(ballback);
//     //_push(users,msg,ballback);
//   }else{
//     res.send({'msg':'PUSH_PERMISSION_DENNIED!','result':0});
//   }
// }
// 以上是即将移除的注释代码


/**
 * 推荐消息给用户
 * example:
 *  pushToUsers(users, {
 *    title: '',
 *    body: '',
 *    description: ''
 *  })
 * @param {Array} users 包含_id和设备信息的用户数据
 * @param {Object} pushMsg 要推送的消息
 */
var pushToUsers = function (users, pushMsg, options) {
  var iosUsers = users.filter(function (user) {
    return user.token_device.platform === 'iOS';
  });
  var androidUsers = users.filter(function (user) {
    return user.token_device.platform === 'Android';
  });

  var iosTokens = [];
  iosUsers.forEach(function (iosUser) {
    if (iosUser.token_device.device_token) {
      iosTokens.push(iosUser.token_device.device_token);
    }
  });
  if (iosTokens.length > 0) {
    clientIOS.pushNotificationToMany({
      alertText: pushMsg.body,
      badge: 1,
      payload: {
        messageFrom: 'Donler',
        campaignId: options.campaignId
      }
    }, iosTokens);
  }


  // todo push to androidUsers

};

exports.push = function (req, res) {
  // 权限验证，只允许本地请求
  if (req.ip !== '127.0.0.1') {
    res.send(403);
    return;
  }

  var query = {};
  var pushMsg = req.body.msg;
  var campaignId = req.body.campaignId;
  switch (req.body.name) {
  case 'companyCampaign':
    // todo 参数合法性验证
    query.cid = { $in: req.body.target.cid };
    break;
  case 'teamCampaign':
    // todo 参数合法性验证
    query['team._id'] = { $in: req.body.target.tid };
    break;
  case 'users':
    // todo 参数合法性验证
    query._id = { $in: req.body.target.uid };
    break;
  default:
    res.send(400);
    return;
  }

  User.find(query, {
    '_id': true,
    'token_device': true
  }).exec()
    .then(function (users) {
      // 不做回调处理，iOS推送无法立即获知是否推送成功，需要不断请求推送结果。
      pushToUsers(users, pushMsg, {
        campaignId: campaignId
      });
      res.send(200, {
        success: true
      });
    })
    .then(null, function (err) {
      console.log(err);
      console.log(err.stack);
      res.send(500, {
        success: false
      });
    });

};

