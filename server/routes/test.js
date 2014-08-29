'use strict';

module.exports = function(app) {
  var test = require('../controllers/test');
  //var push = require('../controllers/push');
  app.get('/test/redis',test.redis);
  //app.get('/test/push/:platform',push.PushTest);
};