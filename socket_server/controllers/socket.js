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
      socket.emit('message',text);
      console.log(io.sockets.adapter.rooms);
    });

    socket.on('disconnect',function(){
      // 从users里删掉这个人
      var whereIsUser = _.indexOf(users, socket.id);
      if(whereIsUser!==-1)
        users[whereIsUser] = null;
      var text = 'user'+whereIsUser+'disconnected';
      console.log(text);
      socket.broadcast.send(text);
    });
    
    socket.on('enterRoom',function(roomIndex){
      socket.join(roomIndex);
      var whereIsUser = _.indexOf(users, socket.id);
      var text = 'user'+whereIsUser + 'has entered room'+ roomIndex;
      console.log(text);
      // socket.broadcast.to(roomIndex).emit('message',text);
      io.sockets.in(roomIndex).emit('message', text);
    });

    socket.on('quitRoom',function(roomIndex){
      var whereIsUser = _.indexOf(users, socket.id);
      var text = 'user'+whereIsUser + 'has quitted room'+ roomIndex;
      console.log(text);
      socket.leave(roomIndex);
      // socket.broadcast.to(socket.rooms).emit('message',text);
      io.sockets.in(roomIndex).emit('message', text);
    });

    socket.on('talk',function(text){
      var whereIsUser = _.indexOf(users, socket.id);
      if(whereIsUser!==-1)
        users[whereIsUser] = null;
      var text = 'user'+whereIsUser+':'+text;
      console.log(socket.rooms[1]);
      // socket.broadcast.to(socket.rooms).emit('message',text);
      io.sockets.in(socket.rooms[1]).emit('message', text);
    });
  });
};