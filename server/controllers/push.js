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
  gateway: 'gateway.push.apple.com',
  cert: rootConfig.root+'/server/service/PushChatCert.pem',
  key:  rootConfig.root+'/server/service/PushChatKey.pem',
  passphrase: '55yali',
  port: 2195,
  enhanced: true,
  cacheLength: 100,
  errorCallback: null

  // host:'cp.pushwoosh.com',
  // path: '/json/1.3/',
  // application:'B13D4-3532F',
  // link:'http://pushwoosh.com/'
}


var clientIOS = null;
var clientAndroid = null;



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



// exports.PushTest = function(req,res){
//   clientAndroid = new PushAndroid(optionsAndroid);
//   var opt = {
//     message_type:1,
//     push_type: 1,
//     //user_id: '1125800188872535509',
//     //user_id: '873187148634115400',
//     user_id: '660104886647897117',
//     messages: JSON.stringify({'title':'这是标题','description':'这是内容'}),
//     msg_keys: 'nick667'
//   }
//   cilentIOS = new PushIOS(optionsIOS);
//   var body = {
//     'application':optionsIOS.application,
//     'auth':'77743b58fdad19fe55565b31ad8eb8b457bd55d90ca56f45c7de5cd2f7bda073',
//     'notifications':{
//       'send_date':new Date(),
//       'content':'信刚你收到了吗收到了吗收到了吗收到了吗收到了吗收到了吗收到了吗',
//       'data':{
//           'custom':'json data'
//       },
//       'link':optionsIOS.link
//     }
//   };

//   var callback = function(data,counter,__callback){
//     counter.i++;
//     __callback();
//     console.log(counter.i,data);
//     return res.send(data);
//   }

//   var counter = {
//     i:0
//   };
//   var sum = 3;
//   async.whilst(
//     function() { return counter.i < sum},
//     function(__callback){
//       if(req.params.platform == 'ios'){
//         cilentIOS.pushMsg(body,function(data){return res.send(data)},counter,__callback);
//       }
//       if(req.params.platform == 'android'){
//         clientAndroid.pushMsg(opt, function(err, result) {
//           if (err) {
//             console.log({'msg':'CAMPAIGN_PUSH_ERROR','result':0,'data':err});
//             callback({'msg':'CAMPAIGN_PUSH_ERROR','result':0,'data':err},counter,__callback);
//           }else{
//             callback({'msg':'CAMPAIGN_PUSH_SUCCESS','result':1,'data':result},counter,__callback);
//           }
//         });
//       }
//     },
//     function(err){
//       if(err){
//         return res.send({'result':0,'msg':'FAILURED'});
//       }else{
//         return res.send({'result':1,'msg':'SUCCESS'});
//       }
//     }
//   );
// }


// var alert ={ "body" : "kakak!", "action-loc-key" : "Play" , "launch-image" : "mysplash.png"};
// var payload = {'messageFrom': 'Holly'};
// var token = "77743b58fdad19fe55565b31ad8eb8b457bd55d90ca56f45c7de5cd2f7bda073";
// cilentIOS.pushMsg(alert,payload,token);




var _push = function(users,msg,out_callback){
  console.log(11111,out_callback);
  var user_id_or_tokens = [];
  //第一步:获取参加活动的所有成员,取出他们的设备推送码(token或者user_id)
  for(var i = 0 ; i < users.length; i ++){
    if(users[i].device){
      for(var j = 0; j < users[i].device.length; j ++){
        if(users[i].device[j].platform == 'Android'){
          user_id_or_tokens.push({
            'platform':'Android',
            '_id':users[i]._id,
            'nickname':users[i].nickname,
            'target':users[i].device[j].user_id
          });
          //第一次初始化
          if(clientAndroid == null || clientAndroid == undefined){
            clientAndroid = new PushAndroid(optionsAndroid);
          }
        }
        if(users[i].device[j].platform == 'IOS'){

          user_id_or_tokens.push({
            'platform':'IOS',
            '_id':users[i]._id,
            'nickname':users[i].nickname,
            'target':users[i].device[j].token
          });
          //第一次初始化
          if(clientIOS == null || clientIOS == undefined){
            cilentIOS = new PushIOS(optionsIOS);
          }
        }
      }
    }
  }

  if(user_id_or_tokens.length > 0){
    //第二步:分别定义IOS和Android的推送信息头

    // var body = {
    //   'application':optionsIOS.application,
    //   'auth':null,
    //   'notifications':{
    //     'send_date':new Date(),
    //     'content':msg.body,
    //     'data':{
    //       'custom':'json data'
    //     },
    //     'link':optionsIOS.link
    //   }
    // }

    var body = {
      'alert':{'body':msg.body},
      'playload':{'messageFrom':'Donler'},
      'token':null
    }

    var opt = {
      message_type:1,
      push_type: 1,
      user_id: null,
      messages: JSON.stringify({'title':msg.title,'description':msg.description}),
      msg_keys: 'nick667'
    }

    //console.log(msg.description);

    //第三步:依次同步推送给所有成员的所有设备
    var callback = function(data,counter,__callback){
      counter.i++;
      __callback();
      console.log(data);
    }
    var counter = {
      i:0
    };
    var sum = user_id_or_tokens.length;
    async.whilst(
      function() { return counter.i < sum},
      function(__callback){
        if(user_id_or_tokens[counter.i].platform == 'IOS'){
          body.token = user_id_or_tokens[counter.i].target;
          cilentIOS.pushMsg(body,out_callback,counter,__callback);
        }
        if(user_id_or_tokens[counter.i].platform == 'Android'){
          opt.user_id = user_id_or_tokens[counter.i].target;
          clientAndroid.pushMsg(opt, function(err, result) {
            if (err) {
              console.log(err);
              callback({'msg':'CAMPAIGN_PUSH_ERROR','result':0,'data':result},counter,__callback);
            }else{
              callback({'msg':'CAMPAIGN_PUSH_SUCCESS','result':1,'data':result},counter,__callback);
            }
          })
        }
      },
      function(err){
        var value;
        if(err){
          value = ({'result':0,'msg':'PUSH_FAILURED'});
        }else{
          value = ({'result':1,'msg':'PUSH_SUCCESS'});
        }
        if(out_callback){
          console.log(22222,out_callback);
          out_callback(value);
        }
      }
    );
  }else{
    if(out_callback){
      if(counter) counter.i ++;
      out_callback({'result':1,'msg':'PUSH_OVER'});
    }
  }
}
//自动判断用户手机平台,推送对应格式的消息
exports.pushCampaign = function(req,res){
  var members = eval('('+req.body.members+')');
  var msg = {
    title : req.body.title,
    body: req.body.body,
    description: req.body.description
  }

  var key = eval('('+req.body.key+')');
  if(key.campaign_id_key == encrypt.encrypt(key.campaign_id,secret.SECRET)){
    //生产模式
    var uids = [];
    if(members){
      for(var i = 0; i < members.length; i ++){
        uids.push(members[i]._id);
      }

      User.find({'_id':{'$in':uids}},{'_id':1,'device':1},function(err,users){
        if(err || !users){
          return res.send({'msg':'USER_NOT_FOUND','result':0});
        }else{
          var msg = {
            body:req.body.body,
            title:req.body.title,
            description:req.body.description
          }
          _push(users,msg,function(data){return res.send(data);});
        }
      });
    }else{
      return res.send({'msg':'NO_USER','result':1});
    }

    // 测试模式
    // var users = [{
    //   '_id':'0',
    //   'nickname':'a',
    //   'device':[{
    //     'platform':'Android',
    //     'user_id':'1125800188872535509'
    //   }]},{
    //   '_id':'1',
    //   'nickname':'b',
    //   'device':[{
    //     'platform':'IOS',
    //     'token':'77743b58fdad19fe55565b31ad8eb8b457bd55d90ca56f45c7de5cd2f7bda073'
    //   }]
    // }
    // ];
    // var ballback = function(data){
    //   return res.send(data);
    // };
    //console.log(ballback);
    //_push(users,msg,ballback);
  }else{
    res.send({'msg':'PUSH_PERMISSION_DENNIED!','result':0});
  }
}


// //自动判断用户手机平台,推送对应格式的消息
// exports.pushCampaign = function(members,msg,out_counter,out_callback){
//   // 生产模式
//   // var uids = [];
//   // if(members){
//   //   for(var i = 0; i < members.length; i ++){
//   //     uids.push(members[i]._id);
//   //   }

//   //   // User.find({'_id':{'$in':uids}},{'_id':1,'device':1},function(err,users){
//   //   //   if(err || !users){
//   //   //     return res.send({'msg':'USER_NOT_FOUND','result':0});
//   //   //   }else{
//   //   //     var msg = {
//   //   //       body:req.body.body,
//   //   //       title:req.body.title,
//   //   //       description:req.body.description
//   //   //     }
//   //   //     _push(users,res,msg);
//   //   //   }
//   //   // });
//   // }else{
//   //   out_counter.i++;
//   //   out_callback();
//   // }

//   // 测试模式
//   var users = [{
//     '_id':'0',
//     'nickname':'a',
//     'device':[{
//       'platform':'Android',
//       'user_id':'1125800188872535509'
//     }]},{
//     '_id':'1',
//     'nickname':'b',
//     'device':[{
//       'platform':'IOS',
//       'token':'77743b58fdad19fe55565b31ad8eb8b457bd55d90ca56f45c7de5cd2f7bda073'
//     }]
//   }
//   ];
//   _push(users,msg,out_counter,out_callback);
// }