'use strict';

module.exports = function(app) {

    var manager = require('../controllers/manager');
    var parameter = require('../controllers/parameter');
    var message = require('../controllers/message');
    var authorization = require('../routes/middlewares/authorization.js');

    app.get('/manager/home', authorization.requiresAdmin,manager.home);
    app.get('/manager/parameter', authorization.requiresAdmin,parameter.home);
    app.get('/manager/message', authorization.requiresAdmin,message.home);

    app.get('/manager/company', authorization.requiresAdmin,manager.getComapnyBasicInfo);
    app.post('/manager/company/detail', authorization.requiresAdmin,manager.getCompanyDetail);
    app.post('/manager/validate', authorization.requiresAdmin,manager.validate);
};
