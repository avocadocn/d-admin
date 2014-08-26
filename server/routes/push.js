'use strict';

module.exports = function(app) {

    var push = require('../controllers/push');

    app.post('/push/campaign/:platform', push.pushCampaign);
    app.post('/push/test/:platform', push.PushTest);
};