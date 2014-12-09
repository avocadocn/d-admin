'use strict';
var _ = require('underscore')._;
var socketioJwt = require('socketio-jwt');

var onlineUsers= [];//user的映射表，看某人在不在线
var index = 0;
module.exports = function (io) {
  io.use(function(socket,next){
    var token = socket.request._query.token
    console.log('token:', token);
    //auth todo
    socket.request._query._id = token;
    next();
  })

  io.on('connection', function (socket) {
    socket.on('login',function(){
      var userId = socket.request._query._id;
      onlineUsers[userId]=socket.id;
      var text = 'user'+userId+'has logined';
      console.log(text);
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
      var text = 'user'+userId+'disconnected';
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
     * 用户评论操作，可能是个人，也可能是某活动（前端到某页面时触发）
     * @param {Object|String} roomId ObjectId和String均可 可能是活动id 也可能是个人id
     */

    socket.on('comment',function(comment){
      //new
      //
      
      //更新列表1(讨论列表):
      //
      

      //更新列表2(详情页列表):
      //
    })

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