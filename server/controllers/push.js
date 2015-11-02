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
    Config = mongoose.model('Config'),
    PushLog = mongoose.model('PushLog');

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
    try{
      initApn(config);
    }
    catch(e){
      console.log(e);
    }
  }
  next();
};


var clientAndroid = new PushAndroid(optionsAndroid);

/**
 * [pushToUser description]
 * @param  {object} user    
 * @param  {object} pushMsg {
 *                            title: '',
 *                            body: '',
 *                            description: ''
 *                          }
 * @param  {object} options: {savePushLogs: boolean}
 */
var pushToUser = function(user, pushMsg, options) {
  if (options.savePushLogs === undefined) {
    options.savePushLogs = true;
  }

  var savePushLogs = function(user, device) {
    if (!options.savePushLogs) { return; }
    var pushLog = new PushLog({
      user: user._id,
      device: device,
      push_title: pushMsg.title,
      push_msg: pushMsg.body
    });
    pushLog.save(function(err) {
      if (err) {
        console.log(err);
      }
    });
  };

  var setFailStatusWhenAndroidPushFail = function(pushUserId) {
    PushLog.update({
      'device.user_id': pushUserId
    }, {status: 'fail'}, function(err) {
      if (err) { console.log(err); }
    });
  };

  var iosTokens = [],androidUserIds =[];
  var device = user.device;
  if(!device.platform){
  }
  else if (device.platform=='iOS' && device.ios_token) {
    iosTokens.push(device.ios_token);
    savePushLogs(user, device);
  }
  else if(device.platform=='Android' && device.channel_id) {
    androidUserIds.push(device.channel_id);
    savePushLogs(user, device);
  }

  if (iosTokens.length > 0) {
    clientIOS.pushNotificationToMany({
      alertText: pushMsg.body,
      badge: 1,
      payload: {
        messageFrom: 'Warm'
      }
    }, iosTokens);
  }
  if (androidUserIds.length > 0) {
    var opt = {
      msg: JSON.stringify({'title':pushMsg.title,'description':pushMsg.body,open_type:2}),
      topic_id: 'warm',
      channel_ids:JSON.stringify(androidUserIds)
    }
    clientAndroid.pushMsg(4, opt, function(err, result) {
      if (err) {
        console.log(err);
        setFailStatusWhenAndroidPushFail(androidUserId);
      }
    });
  }
}

/**
 * [push description]
 * @param  req.body: {
 *           userId: string,
 *           msg: {
 *             title: string,
 *             body: string,
 *             description: string
 *           }
 *         }
 */
exports.push = function(req, res) {
  if (req.ip !== '127.0.0.1') {
    res.send(403);
    return;
  }

  User.findOne({_id:req.body.userId}).exec()
  .then(function (user) {
    if(!user.push_toggle) {
      pushToUser(user, req.body.msg);
    }
    res.send(200, {success: true});
  })
  .then(null, function(err) {
    console.log(err);
    console.log(err.stack);
    res.send(500, {
      success: false
    });
  })

}

/**
 * [repush description]
 * @param  req.body: {
 *           userId: string,
 *           msg: {
 *             title: string,
 *             body: string,
 *             description: string
 *           }
 *         }
 */
exports.repush = function(req, res) {
  PushLog.findById(req.body.pushLogId)
    .populate('user', '_id device')
    .exec()
    .then(function(log) {
      if (log) {
        var pushUser = [{
          device: [log.device]
        }];
        pushToUser(pushUser, {
          title: log.push_title,
          body: log.push_msg
        }, {
          // campaignId: log.campaign,
          savePushLogs: false
        });
        log.status = 'success';
        log.save(function(err) {
          if (err) {
            console.log(err.stack);
            res.send(500, {msg: err.message});
          }
          else {
            res.send({msg: '已重新推送'});
          }
        });
      }
      else {
        res.send(500, {msg: '找不到日志'});
      }
    }, function(err) {
      console.log(err.stack);
      res.send(500, {msg: err.message});
    });
};


