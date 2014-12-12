'use strict';
var _ = require('underscore')._;
var jwt = require('jsonwebtoken');

var tokenSecret = 'donler';
var onlineUsers= {};//user的映射表，看某人在不在线

var actions = function (io, action, data) {
  switch(action){
    //告诉相关user有newComments(首页红点)
    case 'udpateNotification':
      var uids = data.uids;
      // console.log(onlineUsers);
      for(var i=0; i<uids.length; i++){
        var uid = uids[i];
        if(onlineUsers[uid]){//如果他在线
          var socketId = onlineUsers[uid];
          io.sockets.in(socketId).emit('getNewComment');
          //need test
        }
      }
      return;
      break;
    //更新列表1(讨论列表):
    case 'upateCommentList':
      var uids = data.uids;
      for(var i=0; i<uids.length; i++) {
        var uid = uids[i];
        io.sockets.in(uid).emit('newCommentCampaign', data.campaign);
      }
      return;
      break;
    //更新列表2(详情页列表): 
    //谁在这个room 就推给谁
    case 'updateCampaignComment':
      var campaignId = data.campaign;
      io.sockets.in(campaignId).emit('newCampaignComment', data.comment);
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
        if(decoded.type==='server'&&decoded.exp>Date.now()){
          socket.request._query._id = decoded.id;
          // console.log(decoded.id+'conne');
          next();
        }else if(decoded.type==='user'&&decoded.exp>Date.now()){
          socket.request._query._id = decoded.id;
          // console.log(decoded.id);
          next();
        }
        //hr和token不对不连接
      });
    }
  });

  io.on('connect', function (socket) {
    // console.log(io.sockets.connected[io.sockets.sockets[0].id]);
    console.log( socket.request._query._id+' connected.');

    socket.on('login',function(){
      var userId = socket.request._query._id;
      onlineUsers[userId]=socket.id;
      var text = 'user'+userId+'has logined';
      console.log(text);
      console.log(onlineUsers);
      // socket.emit('getNewComment');
      // console.log(io.sockets.adapter);
    });

    /*
     * 失联操作（断网、关闭应用时自动的，否则为一直连接状态）
     * function: 从onlineusers里删除这个人.
     */
    socket.on('disconnect',function(){
      // 从onlineUsers里删掉这个人
      var userId = socket.request._query._id;
      delete onlineUsers[userId];
      var text = 'user'+userId+' disconnected';
      console.log(text);
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
      var whereIsUser = _.indexOf(onlineUsers, socket.id);
      var text = 'user'+whereIsUser + 'has entered room'+ roomIndex;
      console.log(text);
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
     * 用户评论操作 
     * 
     */

    socket.on('commentFromServer',function(uids,campaign,comment){
      //告诉相关user有newComments(首页红点)
      actions(io,'udpateNotification',{'uids':uids});
      //更新列表1(讨论列表):
      actions(io,'upateCommentList',{'uids':uids,'campaign':campaign});
      //更新列表2(详情页列表): 
      //谁在这个room 就推给谁
      actions(io,'updateCampaignComment',{'campaign':campaign,'comment':comment});
    });

    socket.on('talk',function(conversation){
      if(socket.rooms.length===2){
        var whereIsUser = _.indexOf(onlineUsers, socket.id);
        var text = 'user'+whereIsUser+':'+conversation;
        var msg = {msg: text};
        io.sockets.in(socket.rooms[1]).emit('message', msg);
      }else{
        var msg = {msg: 'Sorry, you must enter a room.'};
        socket.emit('message',msg);
      }
    });
  });
};