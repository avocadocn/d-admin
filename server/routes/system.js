'use strict';

module.exports = function(app) {

    var system = require('../controllers/system');

    app.get('/system/setting', system.settingView);
    app.post('/system/setting', system.setNeedCompanyRegisterInviteCode);
    app.post('/system/createCompanyRegisterInviteCode', system.createCompanyRegisterInviteCode);

};
