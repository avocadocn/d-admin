'use strict';
var campaign = require('../controllers/campaign');
var authorization = require('../routes/middlewares/authorization.js');
module.exports = function(app) {

  app.post('/campaign/team', authorization.requiresAdmin,campaign.campaignByTeam);
  app.post('/campaign/search', authorization.requiresAdmin,campaign.searchCompanyForCampaign);
  app.post('/campaign/rule', authorization.requiresAdmin,campaign.campaignByRule);
};