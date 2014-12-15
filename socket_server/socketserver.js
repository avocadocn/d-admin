'use strict';

var fs = require('fs');
var port = 3005;
 
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var morgan = require('morgan');
var bodyParser = require('body-parser');
var socket = require('./controllers/socket');
var serveStatic = require('serve-static');



var walk = function(path, callback) {
  fs.readdirSync(path).forEach(function(file) {
    var newPath = path + '/' + file;
    var stat = fs.statSync(newPath);
    if (stat.isFile()) {
      if (/(.*)\.(js$)/.test(file)) {
        if (callback) {
          callback(file, newPath)
        } else {
          require(newPath);
        }
      }
    } else if (stat.isDirectory()) {
      walk(newPath, callback);
    }
  });
};
// // 初始化 mongoose models
// walk('./models');

var controllers = {};
walk('./controllers', function (file, path) {
  var ctrlName = file.split('.')[0];
  controllers[ctrlName] = require(path);
});

walk('./routes', function (file, path) {
  var routeName = file.split('.')[0];
  var ctrl;
  if (controllers[routeName]) {
    ctrl = controllers[routeName](app,io);
  }
  require(path)(app,ctrl);
});
app.use(serveStatic('public'));

socket(io);

server.listen(port, function(){
  console.log('socket server listen at port:'+port);
});