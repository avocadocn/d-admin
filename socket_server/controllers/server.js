'use strict';

var mongoose = require('mongoose');
var User = mongoose.model('User');


module.exports = function (app, io){
  return {
    index: function(req, res){
      res.sendFile('/Users/yali-07/d-admin/socket_server/index.html');
    }
  }
}