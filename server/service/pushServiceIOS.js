var apn = require('apn');
var rootConfig = require('../config/config');


// var myDevice = new apn.Device(data.token);
// var note = new apn.Notification();
// note.badge = 1;
// note.sound = "notification-beep.wav";
// note.alert = { "body" : "打打打打打打打打打打打打打打打打打打打打打打打打打打信刚!", "action-loc-key" : "Play" , "launch-image" : "mysplash.png"};
// note.payload = {'messageFrom': 'Holly'};

// note.device = myDevice;

// var callback = function(errorNum, notification){
//     console.log('Error is: %s', errorNum);
//     console.log("Note " + notification);
// }


// var callback = function(errorNum, notification){
//     console.log('Error is: %s', errorNum);
//     console.log("Note " + notification);
// }
// var options = {
//     gateway: 'gateway.sandbox.push.apple.com', // this URL is different for Apple's Production Servers and changes when you go to production
//     errorCallback: callback,
//     cert: rootConfig.root+'/server/service/MyApnsCert.pem',
//     key:  rootConfig.root+'/server/service/vitrumdev.pem',
//     passphrase: '55yali',
//     port: 2195,
//     enhanced: true,
//     cacheLength: 100
// }
// var apnsConnection = new apn.Connection(options);
// apnsConnection.sendNotification(note);



function Push(options){
  var self = this;
  self.connect_options = options;
  self.connect_options.errorCallback = function(errorNum, notification){
    console.log('Error is: %s', errorNum);
    console.log("Note " + notification);
  }
  self.apnsConnection = new apn.Connection(self.connect_options);

  //console.log(self.apnsConnection);
}

Push.prototype.pushMsg = function (alert,payload,token,callback,counter,__callback) {
  var self = this;
  self.note = new apn.Notification();
  self.device_token = token;
  self.myDevice = new apn.Device(self.device_token);
  self.note.device = self.myDevice;
  self.note.badge = 1;
  //self.note.sound = "notification-beep.wav";
  self.note.alert = alert;
  self.note.payload = payload;
  var send = false;
  if(self.apnsConnection){
    self.apnsConnection.sendNotification(self.note);
    self.apnsConnection.on('connected',function() {
      //console.log("Connected");
      //if(!send){callback({'msg':'NULL','status':'CONNECTED'});send=true;}
    });
    self.apnsConnection.on('transmitted',function(notification, device) {
      //console.log("Notificationtransmitted to:" + device.token.toString('hex'));
      //if(!send){callback({'msg':'Connected','status':'TRANSMITTED','data':device.token.toString('hex')});send=true;}
    });
    self.apnsConnection.on('transmissionError',function(errCode, notification, device) {
      console.error("Notificationcaused error: " + errCode + " for device ",device,notification);
      if(!send){callback({'msg':'NOTIFICATIONCAUSED ERROR','status':'ERROR','err_code':errCode},counter,__callback);send=true;}
    });
    self.apnsConnection.on('timeout',function () {
      console.log("ConnectionTimeout");
      if(!send){callback({'msg':'CONNECTION_TIMEOUT','status':'TIMEOUT'},counter,__callback);send=true}
    });
    self.apnsConnection.on('disconnected',function() {
      console.log("Disconnectedfrom APNS");
      if(!send){callback({'msg':'DISCONNECTED_FROM_APN_SERVER','status':'DISCONNECTED'},counter,__callback);send=true;}
    });
    self.apnsConnection.on('socketError',function(){
      console.log({'msg':'SOCKET_ERROR','status':'ERROR'});
      if(!send){callback({'msg':'SOCKET_ERROR','status':'ERROR'},counter,__callback);send=true;}
    });
  }
}

module.exports = Push;