'use strict';

module.exports = function(app) {

  var log = require('../controllers/log');
  var authorization = require('../routes/middlewares/authorization.js');

  app.get('/log/logList', authorization.requiresAdmin,log.getLogs);
  app.get('/log/home', authorization.requiresAdmin,log.home);
};