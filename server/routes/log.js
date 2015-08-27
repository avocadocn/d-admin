'use strict';
var log = require('../controllers/log');
var authorization = require('../routes/middlewares/authorization.js');
module.exports = function(app) {
  app.get('/log/logList/:logType', authorization.requiresAdmin,log.getLogs);
};