'use strict';

module.exports = function(app) {
  var _app = require('../controllers/app');
  var authorization = require('../routes/middlewares/authorization.js');
  app.get('/app/apn', authorization.requiresAdmin, _app.getApn);
  app.post('/app/apn', authorization.requiresAdmin, _app.setApn);
  app.post('/app/baidu', authorization.requiresAdmin,_app.baidu);
  app.post('/app/config', authorization.requiresAdmin,_app.config);
  app.get('/app/info',authorization.requiresAdmin,_app.info);
};