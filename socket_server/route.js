'use strict';

module.exports = function (app, ctrl) {

  app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
  });

};