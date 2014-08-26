//推送的具体操作
var mongoose = require('mongoose'),
    PushAndroid = require('../service/pushServiceAndroid'),
    PushIOS = require('../service/pushServiceIOS'),
    secret = require('../config/secret'),
    encrypt = require('../kit/encrypt'),
    rootConfig = require('../config/config'),
    User = mongoose.model('User');

var optionsAndroid = {
   ak: 'pSGg3PHKgD7vdah7eHDydQOu',
   sk: 'pcMcc3WnqQCPNi4GY4xXPXrBanNizo1z'
};
var optionsIOS = {
  gateway: 'gateway.sandbox.push.apple.com',
  cert: rootConfig.root+'/server/service/MyApnsCert.pem',
  key:  rootConfig.root+'/server/service/vitrumdev.pem',
  passphrase: '55yali',
  port: 2195,
  enhanced: true,
  cacheLength: 100,
  errorCallback: null
}


var clientIOS = null;
var clientAndroid = null;

// var cilentIOS = new PushIOS(optionsIOS);
// var clientAndroid = new PushAndroid(optionsAndroid);



// function queryBindList(client) {
//   var opt = {
//     user_id: id0
//   }
//   client.queryBindList(opt, function(err, result) {
//     if (err) {
//       console.log(err);
//       return;
//     }
//     console.log(result);
//   })
// }



exports.PushTest = function(req,res){
  var callback = function(data){
    console.log(1111111111111111111111111,data,res.send);
    return res.send(data);
  }
  if(req.params.platform == 'android'){
    clientAndroid = new PushAndroid(optionsAndroid);
    var opt = {
      message_type:1,
      push_type: 1,
      user_id: '873187148634115400',
      //channel_id: '3467432554363793103',
      messages: JSON.stringify({'title':'暖暖的小脸儿温暖','description':'我的心窝'}),
      msg_keys: 'nick667'
    }
    clientAndroid.pushMsg(opt, function(err, result) {
      if (err) {
        console.log({'msg':'CAMPAIGN_PUSH_ERROR','result':0,'data':err});
        return res.send({'msg':'CAMPAIGN_PUSH_ERROR','result':0,'data':err});
      }
      console.log({'msg':'CAMPAIGN_PUSH_SUCCESS','result':1,'data':result});
      return res.send({'msg':'CAMPAIGN_PUSH_SUCCESS','result':1,'data':result});
    });
  }
  if(req.params.platform == 'ios'){
    cilentIOS = new PushIOS(optionsIOS);
    var alert ={ "body" : "kakak!", "action-loc-key" : "Play" , "launch-image" : "mysplash.png"};
    var payload = {'messageFrom': 'Holly'};
    var token = "77743b58fdad19fe55565b31ad8eb8b457bd55d90ca56f45c7de5cd2f7bda073";
    cilentIOS.pushMsg(alert,payload,token,callback);
  }
}


// var alert ={ "body" : "kakak!", "action-loc-key" : "Play" , "launch-image" : "mysplash.png"};
// var payload = {'messageFrom': 'Holly'};
// var token = "77743b58fdad19fe55565b31ad8eb8b457bd55d90ca56f45c7de5cd2f7bda073";
// cilentIOS.pushMsg(alert,payload,token);


//自动判断用户手机平台,推送对应格式的消息
exports.pushCampaign = function(req,res){
  var callback = function(data){
    return res.send(data);
  }
  var key = req.body.key;
  if(encrypt.encrypt(key.campaign_id,secret.SECRET) === key.campaign_id_key){
    var users = req.body.users;
    var msg = req.body.msg;
    for(var i = 0 ; i < users.length; i ++){
      if(users[i].platform == 'Android'){
        //第一次初始化
        if(clientAndroid == null || clientAndroid == undefined){
          clientAndroid = new PushAndroid(optionsAndroid);
        }
        var opt = {
          push_type: 1,
          user_id: users[i].user_id,
          messages: users[i].msg,
          msg_keys: ['1']
        }
        clientAndroid.pushMsg(opt, function(err, result) {
          if (err) {
            console.log(err);
            return res.send({'msg':'CAMPAIGN_PUSH_ERROR','result':0});
          }
          return res.send({'msg':'CAMPAIGN_PUSH_SUCCESS','result':1});
        })
      }
      if(users[i].platform == 'IOS'){
        //第一次初始化
        if(clientIOS == null || clientIOS == undefined){
          cilentIOS = new PushIOS(optionsIOS);
        }
        var alert ={ "body" : users[i].msg, "action-loc-key" : "Play" , "launch-image" : "mysplash.png"};
        var payload = {'messageFrom': 'Donler'};
        var token = users[i].token;
        cilentIOS.pushMsg(alert,payload,token);
      }
    }
  }else{
    console.log('CAMPAIGN_PUSH_PERMISSION_DENIED');
    return res.send({'msg':'CAMPAIGN_PUSH_PERMISSION_DENIED','result':0});
  }
}