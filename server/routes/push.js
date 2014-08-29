'use strict';

module.exports = function(app) {
  var push = require('../controllers/push');
  app.post('/push/campaign',push.pushCampaign);
  //app.get('/test/push/:platform',push.PushTest);
};