var apn = require('apn');
var rootConfig = require('../config/config');
var http = require('http');
var util = require('util');


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

var debug = false;
/*
 * To encode url
 * @param {String} str Body string
 * @returns {String} encoded url
 * @desc php urlencode is different from js, the way of Push server encode is same with php, so js need do some change
 */
function urlencode (str) {
  // http://kevin.vanzonneveld.net
  str = (str + '').toString();

  // Tilde should be allowed unescaped in future versions of PHP (as reflected below), but if you want to reflect current
  // PHP behavior, you would need to add ".replace(/~/g, '%7E');" to the following.
  return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').
  replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
}


function Push(options){
  var self = this;
  self.connect_options = options;
  self.connect_options.errorCallback = function(errorNum, notification){
    console.log('Error is: %s', errorNum);
    console.log("Note " + notification);
  }
  self.apnsConnection = new apn.Connection(self.connect_options);

  console.log(self.apnsConnection);
}

Push.prototype.pushMsg = function (body,callback,counter,__callback) {
  var self = this;
  self.note = new apn.Notification();
  self.device_token = body.token;
  self.myDevice = new apn.Device(self.device_token);
  self.note.device = self.myDevice;
  self.note.badge = 1;
  //self.note.sound = "notification-beep.wav";
  self.note.alert = body.alert;
  self.note.payload = body.payload;
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



// function Push(options){
//   var self = this;
//   self.connect_options = options;
// }

// Push.prototype.pushMsg = function (bodyArgs,callback,counter,__callback) {
//   var self = this;

//   var bodyArgsArray = [];
//   for (var i in bodyArgs) {
//     if (bodyArgs.hasOwnProperty(i)) {
//       if(typeof bodyArgs[i] == 'object'){
//         bodyArgsArray.push(i + '=' + (JSON.stringify(bodyArgs[i])));
//       }else{
//         bodyArgsArray.push(i + '=' + (bodyArgs[i]));
//       }
//     }
//   }
//   var bodyStr = bodyArgsArray.join('&');

//   //var bodyStr = urlencode(JSON.stringify(bodyArgs));

//   //var bodyStr = querystring.stringify(bodyArgs);

//   if (debug) {
//       console.log('body length = ' + bodyStr.length + ', body str = ' + bodyStr);
//   }

//   var options = {
//       host: self.connect_options.host,
//       method: 'POST',
//       path: self.connect_options.path,
//       headers: {'Content-Length': bodyStr.length,
//                 'Content-Type':'application/json',
//                 'Access-Control-Allow-Origin':'*'
//                }
//   };

//   var req = http.request(options, function (res) {
//       if (debug) {
//           console.log('status = ' + res.statusCode);
//           console.log('res header = ');
//           console.dir(res.headers);
//       }

//       var resBody = '';
//       res.on('data', function (chunk) {
//           resBody += chunk;
//       });

//       res.on('end', function () {
//           if (debug) {
//               console.log('res body: ' + resBody);
//           }

//           //var jsonObj = JSON.parse(resBody);
//            try {
//             var jsonObj = JSON.parse(resBody);
//           } catch(e) {
//             console.log(e,bodyStr);
//             callback({'status':e,'body':resBody});
//             return;
//           }
//           var errObj = null;
//           id.request_id = jsonObj['request_id'];
//           if (res.statusCode != 200) {
//               var error_code = 'Unknown';
//               if (jsonObj['error_code'] !== undefined) {
//                   error_code = jsonObj['error_code'];
//               }

//               var error_msg = 'Unknown';
//               if (jsonObj['error_msg'] !== undefined) {
//                   error_msg = jsonObj['error_msg'];
//               }

//               var request_id = 'Unknown';
//               if (jsonObj['error_msg'] !== undefined) {
//                   request_id = jsonObj['request_id'];
//               }

//               errObj = new Error('Push error code: ' + error_code +
//                                   ', error msg: ' + error_msg +
//                                   ', request id: ' + request_id);
//           }
//           if(callback){
//             callback({'err':errObj, 'rst':jsonObj});
//           }
//           counter.i++;
//           __callback();
//           return;
//       });
//   });

//   req.on('error', function (e) {
//       if (debug) {
//           console.log('error : ' + util.inspect(e));
//       }
//       if(callback){
//         callback({'err':e, 'rst':null});
//       }
//       counter.i++;
//       __callback();
//       return;
//   });

//   req.write(bodyStr);
//   req.end();
// }

module.exports = Push;