'use strict';

module.exports = function(app) {

  var pushLogCtrl = require('../controllers/push_log.js');
  var authorization = require('../routes/middlewares/authorization.js');

  app.get('/push_logs', authorization.requiresAdmin, pushLogCtrl.getLogs);
  app.get('/push_logs/page', authorization.requiresAdmin, pushLogCtrl.page);
};