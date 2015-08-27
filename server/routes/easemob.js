'use strict';

var authorization = require('./middlewares/authorization.js'),
  easemob = require('../controllers/easemob');
module.exports = function(app) {

  app.get('/easemob/info', authorization.requiresAdmin,easemob.info);
  app.post('/easemob/save', authorization.requiresAdmin,easemob.save);
  app.post('/easemob/inithruser', authorization.requiresAdmin,easemob.initHrUser);
  app.post('/easemob/inituser', authorization.requiresAdmin,easemob.initUser);
  app.post('/easemob/initgroup', authorization.requiresAdmin,easemob.initGroup);
};