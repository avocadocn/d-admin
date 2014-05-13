'use strict';

module.exports = function(app) {
  var admin = require('../controllers/admin');
  app.get('/admin/host/get', admin.getHost);
  app.post('/admin/host/set', admin.setHost);
};