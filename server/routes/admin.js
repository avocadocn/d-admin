'use strict';

module.exports = function(app,passport) {

  var admin = require('../controllers/admin');
  var authorization = require('../routes/middlewares/authorization.js');

  app.get('/admin/host/get',authorization.requiresAdmin, admin.getHost);
  app.get('/admin/logout', admin.logout);

  app.post('/admin/host/set', authorization.requiresAdmin,admin.setHost);

  app.get('/createAdmin', authorization.requiresAdmin, admin.createAdminView);
  app.post('/createAdmin', authorization.requiresAdmin, admin.createAdmin);

  app.get('/admin/login/:status',admin.login);
  app.post('/admin/login', passport.authenticate('local', {
      failureRedirect: '/admin/login/failure',
      failureFlash: true
  }),  admin.loginSuccess);
  app.get('/init', authorization.requiresAdmin, admin.init);

  app.get('/admin/smtp', authorization.requiresAdmin, admin.getSMTP);
  app.post('/admin/smtp', authorization.requiresAdmin, admin.setSMTP);
};