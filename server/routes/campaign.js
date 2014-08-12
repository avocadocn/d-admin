'use strict';

module.exports = function(app) {
  var campaign = require('../controllers/campaign');
  var authorization = require('../routes/middlewares/authorization.js');
  app.post('/campaign/team', authorization.requiresAdmin,campaign.campaignByTeam);
  //app.post('/campaign/search', authorization.requiresAdmin,campaign.campaignByTeam);
};