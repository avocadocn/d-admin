'use strict';

module.exports = function(app) {
  var team = require('../controllers/team');
  var authorization = require('../routes/middlewares/authorization.js');
  app.post('/team/search', authorization.requiresAdmin,team.searchCompanyForTeam);
  app.post('/team/group', authorization.requiresAdmin,team.getTeamByGroup);
};