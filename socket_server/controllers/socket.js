'use strict';
var _ = require('underscore')._;
var jwt = require('jsonwebtoken');

var tokenSecret = 'donler';
var onlineUsers= {};//user的映射表，看某人在不在线

var actions = function (io, action, data) {
  switch(action){
    //告诉相关user有newChat(首页红点)
    case 'udpateNotification':
      var uids = data.uids;
      for(var i=0; i<uids.length; i++){
        var uid = uids[i];
        if(onlineUsers[uid] && uid!==data.chat.poster._id.toString()){//如果他在线，并且不是自己
          var socketId = onlineUsers[uid];
          io.sockets.in(socketId).emit('getNewChat', data.chat);
        }
      }
      return;
      break;
    case 'upadteChat':
      var chatroomId = data.chat.chatroom_id;
      io.sockets.in(chatroomId).emit('newChat', data.chat);
      return;
      break;
    case 'updateCircleContent':
      var uids = data.userIds;
      for(var i=0; i<uids.length; i++) {
        //除了自己都通知content有新内容，带头像。
        //其实发过来的数据应该是没有发的人的id的...以防万一而已。
        var uid = uids[i];
        if(onlineUsers[uid] && uid!==data.poster._id.toString()) {
          var socketId = onlineUsers[uid];
          io.sockets.in(socketId).emit('getNewCircleContent', data.poster.photo);
        }
      }
      return;
      break;
    case 'updateCircleComment':
      var uids = data.userIds;
      for(var i=0; i<uids.length; i++) {
        var uid = uids[i];
        if(onlineUsers[uid] && uid!==data.poster._id.toString()) {
          var socketId = onlineUsers[uid];
          io.sockets.in(socketId).emit('getNewCircleComment', data.poster.photo);
        }
      }
      break;
    case 'updateDiscover':
      var leaderId = data.leaderId;
      if(onlineUsers[leaderId]) {
        var socketId = onlineUsers[leaderId];
        io.sockets.in(socketId).emit('newCompetitionMessage');
      }
      break;
    default:
      return;
  }
};

module.exports = function (io) {
  io.use(function(socket,next){
    var token = socket.request._query.token;
    if(token){
      jwt.verify(token,tokenSecret,function(err, decoded){
        if(decoded){//防止有的时候解析token失败而崩掉
          if(decoded.type==='server'&&decoded.exp>Date.now()){
            socket.request._query._id = decoded.id;
            // console.log(decoded.id+'conne');
            next();
          }else if(decoded.type==='user'&&decoded.exp>Date.now()){
            socket.request._query._id = decoded.id;
            // console.log(decoded.id);
            next();
          }
        }
        //hr和token不对不连接
      });
    }
  });

  io.on('connect', function (socket) {
    // console.log(io.sockets.connected[io.sockets.sockets[0].id]);
    // console.log( socket.request._query._id+' connected.');

    var userId = socket.request._query._id;
    onlineUsers[userId]=socket.id;
    // console.log(io.sockets.adapter);

    /*
     * 失联操作（断网、关闭应用时自动的，否则为一直连接状态）
     * function: 从onlineusers里删除这个人.
     */
    socket.on('disconnect',function(){
      // 从onlineUsers里删掉这个人
      var userId = socket.request._query._id;
      delete onlineUsers[userId];
      var text = 'user'+userId+' disconnected';
      // console.log(text);
    });

    /*
     * 进入房间操作，可能是个人，也可能是某活动（前端到某页面时触发）
     * @param {Object|String} roomId ObjectId和String均可 可能是活动id 也可能是个人id
     */
    socket.on('enterRoom',function(roomId){
      if(socket.rooms.length>1){
        socket.leave(socket.rooms[1]);
      }
      socket.join(roomId);
    });

    /*
     * 退出房间操作(离开某页面时触发)
     */
    socket.on('quitRoom',function(){
      if(socket.rooms.length===2){
        var roomIndex = socket.rooms[1];
        socket.leave(roomIndex);
      }
    });

    socket.on('chatFromServer', function(chatroomId, chat, userIds) {
      //告诉相关user有newChat(首页红点)
      actions(io, 'udpateNotification', {'uids': userIds, 'chat': chat});
      //更新chatroom列表的最新讨论 updateNotification已更新，无需在chatroom页再做更新
      // actions(io, 'updateChatrooms', {'uids': userIds, 'chat': chat});
      //更新讨论详情页
      actions(io, 'upadteChat', {'uids': userIds, 'chat': chat});
    });

    //公司页红点、同事圈头像显示or红点?
    socket.on('circleContent', function(userIds, poster) {
      actions(io, 'updateCircleContent', {'userIds':userIds, 'poster':poster});
    });
    //同事圈带数字红点、公司页带数字红点or红点?
    socket.on('circleComment', function(userIds, poster) {
      actions(io, 'updateCircleComment', {'userIds':userIds, 'poster':poster});
    });
    //有挑战信或挑战信评论的push
    socket.on('competitionMessage', function(leaderId) {
      actions(io, 'updateDiscover', {'leaderId': leaderId});
    });

    // socket.on('talk',function(conversation){
    //   if(socket.rooms.length===2){
    //     var whereIsUser = _.indexOf(onlineUsers, socket.id);
    //     var text = 'user'+whereIsUser+':'+conversation;
    //     var msg = {msg: text};
    //     io.sockets.in(socket.rooms[1]).emit('message', msg);
    //   }else{
    //     var msg = {msg: 'Sorry, you must enter a room.'};
    //     socket.emit('message',msg);
    //   }
    // });
  });
};