'use strict';

module.exports = function(app) {
    var system = require('../controllers/system');
    var authorization = require('../routes/middlewares/authorization.js');

    app.get('/system/getcode', authorization.requiresAdmin,system.getCode);
    //app.get('/system/setting', authorization.requiresAdmin,system.settingView);
    app.post('/system/setting', authorization.requiresAdmin,system.setNeedCompanyRegisterInviteCode);
    app.get('/system/getting', authorization.requiresAdmin,system.getCodeSwitch);

    app.post('/system/createCompanyRegisterInviteCode', authorization.requiresAdmin,system.createCompanyRegisterInviteCode);
    app.post('/system/rankUpdate', authorization.requiresAdmin, system.rankUpdate);
};
