'use strict';
var moment = require('moment');
var jwt = require('jsonwebtoken');
var client = require('socket.io-client');
var host = "http://www.donler.com";
var async = require('async');

var tokenSecret = 'donler';
var getToken = function(){
  var token = jwt.sign({
    type: "server",
    id: 'APIServer',
    exp: moment().add(365, 'days').valueOf()
  }, tokenSecret);
  return token;
}

var socketTest = function(i) {
  var socket = client.connect(host+':3005',{query:'token=' + getToken(), forceNew:true});
  socket.on('connect',function(){
    console.log(i);
  });
};

async.times(6000, function(n, next) {
  socketTest(n);
  next();
},function(err, data) {
  console.log(err);
});
// for (var i = 0; i <5000; i++) {
//   socketTest(i);
// }
