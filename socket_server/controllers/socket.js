'use strict';
var _ = require('underscore')._;

var users= [];//user的映射表，看某人在不在线
var index = 0;
module.exports = function (io) {
  io.on('connection', function (socket) {
    console.log('someone connected');
    socket.on('login',function(){
      users[index]=socket.id;
      console.log('user'+index+'login');
      index++;
    });
    socket.on('disconnect',function(){
      // 从users里删掉这个人
      var whereIsUser = _.indexOf(users, socket.id);
      if(whereIsUser!==-1)
        users[whereIsUser] = null;
      console.log('user'+whereIsUser+'disconnected');
    });
    
  });
};