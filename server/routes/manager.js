'use strict';
var manager = require('../controllers/manager');
var parameter = require('../controllers/parameter');
var authorization = require('../routes/middlewares/authorization.js');
var multerService = require('../service/multerService.js');
module.exports = function(app) {
  app.get('/manager/template/:name', authorization.requiresAdmin,manager.template);
  app.get('/manager/parameter', authorization.requiresAdmin,parameter.home);
  app.get('/manager/company', authorization.requiresAdmin,manager.getCompanyBasicInfo);
  app.post('/manager/company', authorization.requiresAdmin, multerService.upload('company/logo').single('photo'), manager.createCompany);
  app.post('/manager/search', authorization.requiresAdmin,manager.searchCompany);
  app.post('/manager/company/detail', authorization.requiresAdmin,manager.getCompanyDetail);
  app.post('/manager/validate', authorization.requiresAdmin,manager.validate);
  app.post('/manager/active', authorization.requiresAdmin,manager.disableAll);
  app.post('/manager/edit/name', authorization.requiresAdmin,manager.editName);
};
