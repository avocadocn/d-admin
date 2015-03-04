'use strict';
var _ = require('underscore')._;
var jwt = require('jsonwebtoken');

var tokenSecret = 'donler';
var onlineUsers= {};//user的映射表，看某人在不在线

var actions = function (io, action, data) {
  switch(action){
    // //告诉相关user有newComments(首页红点)
    // case 'udpateNotification':
    //   var uids = data.uids;
    //   // console.log(onlineUsers);
    //   for(var i=0; i<uids.length; i++){
    //     var uid = uids[i];
    //     if(onlineUsers[uid] && uid!==data.comment.poster._id){//如果他在线，并且不是自己
    //       var socketId = onlineUsers[uid];
    //       io.sockets.in(socketId).emit('getNewComment');
    //       //need test
    //     }
    //   }
    //   return;
    //   break;
    // //更新列表1(讨论列表):
    // case 'upateCommentList':
    //   var joinedUids = data.joinedUids;
    //   for(var i=0; i<joinedUids.length; i++) {
    //     var uid = joinedUids[i];
    //     io.sockets.in(uid).emit('newCommentCampaign', data.campaign);//已参加
    //   }
    //   var unjoinedUids = data.unjoinedUids;
    //   for(var i=0; i<unjoinedUids.length; i++) {
    //     var uid = unjoinedUids[i];
    //     io.sockets.in(uid).emit('newUnjoinedCommentCampaign', data.campaign);//未参加
    //   }
    //   return;
    //   break;
    // //更新列表2(详情页列表): 
    // //谁在这个room 就推给谁
    // case 'updateCampaignComment':
    //   var campaignId = data.campaign._id;
    //   io.sockets.in(campaignId).emit('newCampaignComment', data.comment);
    //   return;
    //   break;
    //告诉相关user有newChat(首页红点)
    case 'udpateNotification':
      var uids = data.uids;
      for(var i=0; i<uids.length; i++){
        var uid = uids[i];
        if(onlineUsers[uid] && uid!==data.chat.poster.toString()){//如果他在线，并且不是自己
          var socketId = onlineUsers[uid];
          io.sockets.in(socketId).emit('getNewChat');
        }
      }
      return;
      break;
    case 'updateChatrooms':
      var uids = data.uids;
      for(var i=0; i<uids.length; i++) {
        var uid = uids[i];
        io.sockets.in(uid).emit('newChat', data.chat);
      }
      return;
      break;
    case 'upadteChat':
      var chatroomId = data.chat._id;
      io.sockets.in(chatroomId).emit('newChat', data.chat);
      return;
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

    /*
     * 用户评论操作 (2015/3/4后已不用)
     * 
     */

    // socket.on('commentFromServer',function(joinedUids, unjoinedUids, campaign, comment){
    //   //告诉相关user有newComments(首页红点)
    //   actions(io,'udpateNotification',{'uids':joinedUids.concat(unjoinedUids), 'comment':comment});
    //   //更新列表1(讨论列表):
    //   actions(io,'upateCommentList',{'joinedUids':joinedUids, 'unjoinedUids':unjoinedUids, 'campaign':campaign});
    //   //更新列表2(详情页列表): 
    //   //谁在这个room 就推给谁
    //   actions(io,'updateCampaignComment',{'campaign':campaign, 'comment':comment});
    // });

    socket.on('chatFromServer', function(chatroomId, chat, userIds) {
      //告诉相关user有newChat(首页红点)
      actions(io, 'udpateNotification', {'uids': userIds, 'chat': chat});
      //更新chatroom列表的最新讨论
      actions(io, 'updateChatrooms', {'uids': userIds, 'chat': chat});
      //更新讨论详情页
      actions(io, 'upadteChat', {'uids': userIds, 'chat': chat});
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