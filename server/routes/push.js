'use strict';

module.exports = function(app) {
  var pushCtrl = require('../controllers/push');
  //app.post('/push/campaign',push.pushCampaign);
  //app.get('/test/push/:platform',push.PushTest);
  app.post('/push', pushCtrl.push);
};