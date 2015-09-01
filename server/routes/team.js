'use strict';

module.exports = function(app) {
  var team = require('../controllers/team');
  var authorization = require('../routes/middlewares/authorization.js');
  app.get('/team/list/:companyId', authorization.requiresAdmin,team.searchCompanyForTeam);
  app.get('/team/:teamId', authorization.requiresAdmin,team.getTeam);
  // app.post('/team/group', authorization.requiresAdmin,team.getTeamByGroup);
  // app.post('/team/addCity',authorization.requiresAdmin,team.teamAddCity);
};