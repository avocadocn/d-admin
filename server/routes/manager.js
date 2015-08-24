'use strict';
var manager = require('../controllers/manager');
var parameter = require('../controllers/parameter');
var message = require('../controllers/message');
var region = require('../controllers/region');
var error = require('../controllers/error');
var user = require('../controllers/user');
var _app = require('../controllers/app');
var team = require('../controllers/team');
var campaign = require('../controllers/campaign');
var department = require('../controllers/department');
var authorization = require('../routes/middlewares/authorization.js');
var multerService = require('../service/multerService.js');
module.exports = function(app) {
    app.get('/manager/home', authorization.requiresAdmin,manager.home);
    app.get('/manager/parameter', authorization.requiresAdmin,parameter.home);
    app.get('/manager/message', authorization.requiresAdmin,message.home);
    app.get('/manager/region', authorization.requiresAdmin,region.home);
    app.get('/manager/error', authorization.requiresAdmin,error.home);
    app.get('/manager/user', authorization.requiresAdmin,user.home);
    app.get('/manager/team', authorization.requiresAdmin,team.home);
    app.get('/manager/campaign', authorization.requiresAdmin,campaign.home);
    app.get('/manager/department', authorization.requiresAdmin,department.home);
    app.get('/manager/app', authorization.requiresAdmin,_app.home);

    app.get('/manager/company', authorization.requiresAdmin,manager.getCompanyBasicInfo);
    app.post('/manager/company', authorization.requiresAdmin, multerService.upload('company/logo').single('photo'), manager.createCompany);
    app.post('/manager/search', authorization.requiresAdmin,manager.searchCompany);
    app.post('/manager/company/detail', authorization.requiresAdmin,manager.getCompanyDetail);
    app.post('/manager/validate', authorization.requiresAdmin,manager.validate);
    app.post('/manager/active', authorization.requiresAdmin,manager.disableAll);
    app.post('/manager/edit/name', authorization.requiresAdmin,manager.editName);
};
