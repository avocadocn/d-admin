'use strict';

module.exports = function(app) {
  var department = require('../controllers/department');
  var authorization = require('../routes/middlewares/authorization.js');
  app.post('/department/search', authorization.requiresAdmin,department.searchCompanyForDepartment);
};