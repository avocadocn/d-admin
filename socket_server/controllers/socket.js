'use strict';
var _ = require('underscore')._;

var users= [];//user的映射表，看某人在不在线
var index = 0;
module.exports = function (io) {
  io.on('connection', function (socket) {
    console.log('someone connected');
    socket.on('login',function(){
      users[index]=socket.id;
      var text = 'user'+index+'has logined';
      console.log(text);
      index++;
      socket.broadcast.send('message',text);
      io.sockets.emit('message',text);
      console.log(users);
      console.log(io.sockets.adapter);
    });

    socket.on('disconnect',function(){
      // 从users里删掉这个人
      var whereIsUser = _.indexOf(users, socket.id);
      if(whereIsUser!==-1)
        users[whereIsUser] = null;
      console.log(users);
      var text = 'user'+whereIsUser+'disconnected';
      console.log(text);
      io.sockets.emit('message',text);
    });
    
    socket.on('enterRoom',function(roomIndex){
      if(socket.rooms[1]){
        socket.emit('message','Sorry ,you have entered a room, please quit.');
      }
      else{
        socket.join(roomIndex);
        var whereIsUser = _.indexOf(users, socket.id);
        var text = 'user'+whereIsUser + 'has entered room'+ roomIndex;
        console.log(text);
        io.sockets.in(roomIndex).emit('message', text);
      }
    });

    socket.on('quitRoom',function(){
      if(socket.rooms.length===2){
        var roomIndex = socket.rooms[1];
        var whereIsUser = _.indexOf(users, socket.id);
        var text = 'user'+whereIsUser + 'has quitted room'+ roomIndex;
        console.log(text);
        io.sockets.in(roomIndex).emit('message', text);
        socket.leave(roomIndex);
      }
      else{
        socket.emit('message','Please select a room to enter.');
      }
    });

    socket.on('talk',function(conversation){
      if(socket.rooms.length===2){
        var whereIsUser = _.indexOf(users, socket.id);
        var text = 'user'+whereIsUser+':'+conversation;
        io.sockets.in(socket.rooms[1]).emit('message', text);
      }else{
        socket.emit('message','Sorry, you must enter a room.');
      }
    });
  });
};