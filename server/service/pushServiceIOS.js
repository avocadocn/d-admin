var apn = require('apn');

/**
 * 创建一个apn连接用于ios push
 * example:
 *  CreateService({
 *    gateway: 'gateway.sandbox.push.apple.com',
 *    cert: rootConfig.root+'/server/service/PushChatCert.pem',
 *    key:  rootConfig.root+'/server/service/PushChatKey.pem',
 *    passphrase: '55yali',
 *    port: 2195,
 *    enhanced: true,
 *    cacheLength: 100
 *  })
 * @param {Object} options 配置选项
 * @constructor
 */
var CreateService = function (options) {
  var service = new apn.connection(options);

  service.on('connected', function() {
    console.log("Connected");
  });

  service.on('transmitted', function (notification, device) {
    console.log("Notification transmitted to:" + device.token.toString('hex'));
  });

  service.on('transmissionError', function(errCode, notification, device) {
    console.error("Notification caused error: " + errCode + " for device ", device, notification);
    if (errCode == 8) {
      console.log("A error code of 8 indicates that the device token is invalid. This could be for a number of reasons - are you using the correct environment? i.e. Production vs. Sandbox");
    }
  });

  service.on('timeout', function () {
    console.log("Connection Timeout");
  });

  service.on('disconnected', function() {
    console.log("Disconnected from APNS");
  });

  service.on('socketError', console.error);

  /**
   * 向多个设备推送
   * example:
   *  pushNotificationToMany({
   *    alertText: '',
   *    badge: 1,
   *    payload: {
   *      messageFrom: 'Donler'
   *    }
   *  })
   * @param noteOptions
   * @param tokens
   */
  service.pushNotificationToMany = function (noteOptions, tokens) {
    var note = new apn.notification();
    note.setAlertText(noteOptions.alertText);
    note.badge = noteOptions.badge;
    note.payload = noteOptions.payload;
    service.pushNotification(note, tokens);
  };

  return service;

};

/**
 * 创建feedback service
 * example:
 *  CreateFeedback({
 *    address: 'feedback.sandbox.push.apple.com',
 *    interval: 10,
 *    feedbackCallback: function (feedbackData) {},
 *    errorCallback: function (err) {}
 *  })
 * @param {Object} options
 * @param {Function} feedbackCallback
 * @param {Function} errorCallback
 * @constructor
 */
var CreateFeedback = function (options, feedbackCallback, errorCallback) {
  var feedback = new apn.feedback(options);

  if (feedbackCallback) {
    feedback.on('feedback', feedbackCallback);
  }
  if (errorCallback) {
    feedback.on('feedbackError', errorCallback);
  }
  return feedback;
};

exports.CreateService = CreateService;
exports.CreateFeedback = CreateFeedback;
