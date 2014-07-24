'use strict';

module.exports = function(app) {

    var manager = require('../controllers/manager');

    app.get('/manager/home', manager.home);

    app.get('/manager/company', manager.getComapnyBasicInfo);
    app.post('/manager/company/detail', manager.getCompanyDetail);
    app.post('/manager/validate', manager.validate);
};
