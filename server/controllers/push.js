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

  var iosTokens = [],androidUserIds =[];
  users.forEach(function (user) {
    user.device.forEach(function(device){
      if(!device.platform){

      }
      else if (device.platform=='iOS' && device.ios_token) {
        iosTokens.push(device.ios_token);
      }
      else if(device.platform=='Android' && device.user_id) {
        androidUserIds.push(device.user_id);
      }
    });
    
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
  if (androidUserIds.length > 0) {
    var opt = {
      message_type:1,
      push_type: 1,
      messages: JSON.stringify({'title':pushMsg.title,'description':pushMsg.body}),
      msg_keys: 'donler'
    }
    androidUserIds.forEach(function(androidUserId){
      opt.user_id = androidUserId;
      clientAndroid.pushMsg(opt, function(err, result) {
        if (err) {
          console.log(err);
        }
      });
    });
  }

};

exports.push = function (req, res) {
  // 权限验证，只允许本地请求
  if (req.ip !== '127.0.0.1') {
    res.send(403);
    return;
  }

  var query = {push_toggle: { $ne: true }};
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
    '_id': 1,
    'device': 1
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

