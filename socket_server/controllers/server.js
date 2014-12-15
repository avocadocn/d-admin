'use strict';


module.exports = function (app, io){
  return {
    index: function(req, res){
      res.sendFile('/Users/yali-07/d-admin/socket_server/public/index.html');
    }
  }
}