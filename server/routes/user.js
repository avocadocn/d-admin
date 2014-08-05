'use strict';

module.exports = function(app) {
  var user = require('../controllers/user');
  var authorization = require('../routes/middlewares/authorization.js');
  app.post('/user/search', authorization.requiresAdmin,user.searchCompanyForUser);
  app.post('/user/active', authorization.requiresAdmin,user.userModify);
  app.post('/user/team', authorization.requiresAdmin,user.userByTeam);
};