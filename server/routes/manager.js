'use strict';

module.exports = function(app) {

    var manager = require('../controllers/manager');
    var authorization = require('../routes/middlewares/authorization.js');

    app.get('/manager/home', authorization.requiresAdmin,manager.home);

    app.get('/manager/company', authorization.requiresAdmin,manager.getComapnyBasicInfo);
    app.post('/manager/company/detail', authorization.requiresAdmin,manager.getCompanyDetail);
    app.post('/manager/validate', authorization.requiresAdmin,manager.validate);
};