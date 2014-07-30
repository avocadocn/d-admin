'use strict';

//站内信

var mongoose = require('mongoose'),
    Admin = mongoose.model('Admin'),
    Company = mongoose.model('Company'),
    Message = mongoose.model('Message'),
    MessageContent = mongoose.model('MessageContent');



/*
* collection:目标文档
* type:      查询方式
* condition: 查询条件
* limit:     过滤条件
* callback:  队查询结果进行处理的回调函数
* sort:      排序方式
* _err:      错误处理函数
*/



function get(param){
  switch(param.type){
    case 0:
      if(param.populate == undefined || param.populate == null){
        param.collection.findOne(param.condition,param.limit,function(err,message){
          if(err || !message){
            param._err(err,param.req,param.res);
          }else{
            param.callback(message,param.other_param,param.req,param.res);
          }
        });
      }else{
        param.collection.findOne(param.condition,param.limit).populate(param.populate).exec(function(err,message){
          if(err || !message){
            param._err(err,param.req,param.res);
          }else{
            param.callback(message,param.other_param,param.req,param.res);
          }
        });
      }
      break;
    case 1:
      if(param.populate == undefined || param.populate == null){
        param.collection.find(param.condition,param.limit).sort(param.sort).exec(function(err,messages){
          if(err || !messages){
            param._err(err,param.req,param.res);
          }else{
            param.callback(messages,param.other_param,param.req,param.res);
          }
        });
      }else{
        param.collection.find(param.condition,param.limit).sort(param.sort).populate(param.populate).exec(function(err,messages){
          if(err || !messages){
            param._err(err,param.req,param.res);
          }else{
            param.callback(messages,param.other_param,param.req,param.res);
          }
        });
      }
      break;
    default:break;
  }
}

/*
* collection:目标文档
* type:      更新方式
* condition: 查询条件
* operate:   更新方法
* callback:  回调函数
* _err:      错误处理函数
*/
function set(param){
  switch(param.type){
    case 0:
      param.collection.update({'_id':param.condition},param.operate,function(err,message){
        if(err || !message){
          param._err(err,param.req,param.res);
        }else{
          param.callback(message,param.other_param,param.req,param.res);
        }
      });
    case 1:
      param.collection.update(param.condition,param.operate,{multi: true},function(err,message){
        if(err || !message){
          param._err(err,param.req,param.res);
        }else{
          param.callback(message,param.other_param,param.req,param.res);
        }
      });
    default:break;
  }
}


function _add(param){
  param.collection.create(param.operate,function(err,message){
    if(err || !message){
      if(param._err!=null && typeof param._err == 'function'){
        param._err(err,param.req,param.res);
      }
    } else {
      if(param.callback!=null && typeof param.callback == 'function'){
        param.callback(message,param.other_param,param.req,param.res);
      }
    }
  })
}

function drop(param){
  param.collection.remove(param.condition,function(err,message){
    if(err || !message){
      param._err(err,param.req,param.res);
    }else{
      param.callback(message);
    }
  });
}

var _err = function(err,req,res){
  console.log(err);
}


//列出已发送消息
exports.senderList = function(req,res){
  var callback = function(message_contents,other,req,res){
    res.send({'msg':'SUCCESS','message_contents':message_contents});
  }
  var _condition = {'type':'global','status':'undelete'};
  var paramA = {
    'collection':MessageContent,
    'type':1,
    'condition':_condition,
    'limit':null,
    'sort':{'post_date':-1},
    'callback':callback,
    '_err':_err,
    'other_param':null,
    'req':req,
    'res':res
  };
  get(paramA);
}


//修改站内信状态
exports.setMessageStatus = function(req,res){
  var status = req.body.status;
  var status_model = ['read','unread','delete','undelete'];
  if(status_model.indexOf(status) > -1){
    var operate = {'$set':{'status':status}};
    var callback = function(value){
      res.send({'msg':'MODIFY_OK'});
    }
    var param = {
      'collection':MessageContent,
      'operate':operate,
      'callback':callback,
      '_err':_err
    };
    if(!req.body.multi){
      var msg_id = req.body.msg_id;
      param.condition = msg_id;
      param.type = 0;
    }else{
      param.condition = {'type':'global','status':{'$ne':'delete'}};
      param.type = 1;
    }
    set(param);
  }else{
    res.send({'msg':'STATUS_ERROR'});
  }
}

var time_out = 72 * 3600 * 1000;

//站内信的上帝模式
exports.adminSendToAll = function(req,res){
  var content = req.body.content;
  var callback = function (message_content,other,req,res){
    exports.senderList(req,res);
  }
  var MC={
    'caption':'Message From Donler',
    'content':content,
    'sender':[],
    'team':[],
    'type':'global',
    'deadline':(new Date())+time_out
  };
  var _param = {
    'collection':MessageContent,
    'operate':MC,
    'callback':callback,
    '_err':_err,
    'other_param':null,
    'req':req,
    'res':res
  };
  _add(_param);
}


exports.home = function (req ,res){
  res.render('system/message');
}