'use strict';

var pushLogCtrl = require('../controllers/push_log.js');
var authorization = require('../routes/middlewares/authorization.js');
module.exports = function(app) {
  app.get('/push_logs', authorization.requiresAdmin, pushLogCtrl.getLogs);
};