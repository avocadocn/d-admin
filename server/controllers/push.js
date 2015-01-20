//推送的具体操作
var path = require('path');

var mongoose = require('mongoose'),
    PushAndroid = require('../service/pushServiceAndroid'),
    PushIOS = require('../service/pushServiceIOS'),
    secret = require('../config/secret'),
    encrypt = require('../kit/encrypt'),
    rootConfig = require('../config/config'),
    async = require('async'),
    User = mongoose.model('User'),
    Config = mongoose.model('Config');

var meanConfig = require('../config/config');
var pemPath = path.join(meanConfig.root, 'server/service/ios-push-pem/');

var optionsAndroid = {
   ak: 'pSGg3PHKgD7vdah7eHDydQOu',
   sk: 'pcMcc3WnqQCPNi4GY4xXPXrBanNizo1z'
};

// var optionsAndroid = {
//    ak: 'C8aqWRQiPFlpcKsuL3Iru7d6',
//    sk: 'nyPPYGqDmybQcQyQlOeehLUZAXegfciP'
// };

var clientIOS, iosFeedbackService;
var currentApnConfig;

var isTheSameApnConfig = function (config1, config2) {
  try {
    if (config1.push.gateway === config2.push.gateway
      && config1.push.port === config2.push.port
      && config1.feedback.gateway === config2.feedback.gateway
      && config1.feedback.port === config2.feedback.port
      && config1.feedback.interval === config2.feedback.interval
      && config1.cert_path === config2.cert_path
      && config1.key_path === config2.key_path
      && config1.passphrase === config2.passphrase) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
};

var initApn = function (config) {
  var apn = config.push.apn;
  currentApnConfig = apn;
  clientIOS = PushIOS.CreateService({
    gateway: apn.push.gateway,
    cert: path.join(pemPath, apn.cert_path),
    key:  path.join(pemPath, apn.key_path),
    passphrase: apn.passphrase,
    port: apn.push.port,
    enhanced: true,
    cacheLength: 100
  });
  iosFeedbackService = PushIOS.CreateFeedback({
    gateway: apn.feedback.gateway,
    cert: path.join(pemPath, apn.cert_path),
    key:  path.join(pemPath, apn.key_path),
    passphrase: apn.passphrase,
    interval: apn.feedback.interval,
    port: apn.feedback.port
  }, function (feedbackData) {
    var time, device;
    for (var i in feedbackData) {
      time = feedbackData[i].time;
      device = feedbackData[i].device;
      console.log("Device: " + device.toString('hex') + " has been unreachable, since: " + time);
    }
  }, console.log);
};

exports.getConfig = function (req, res, next) {
  Config.findOne({ 'name': 'admin' }).exec()
    .then(function (config) {
      if (!config) {
        console.error('获取配置数据失败')
        res.send(500, {
          success: false
        });
        return;
      }
      req.donlerConfig = config;
      next();
    })
    .then(null, function (err) {
      console.error(err.stack);
      res.send(500, {
        success: false
      });
    });
};

exports.shouldPush = function (req, res, next) {
  var config = req.donlerConfig;
  if (config.push.status === 'on') {
    next();
  } else {
    res.send(200, {
      success: false
    });
  }
};

exports.initIOS = function (req, res, next) {
  var config = req.donlerConfig;
  if (!config || !config.push || !config.push.apn) {
    console.error('没有配置apn');
    res.send(500, {
      success: false
    });
    return;
  }
  if (!isTheSameApnConfig(currentApnConfig, config.push.apn)) {
    initApn(config);
  }
  next();
};


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
      messages: JSON.stringify({'title':pushMsg.title,'description':pushMsg.body,open_type:2,custom_content: {campaignId:options.campaignId}}),
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

