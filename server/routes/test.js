'use strict';

module.exports = function(app) {
  var test = require('../controllers/test');
  app.get('/test/redis',test.redis);
};