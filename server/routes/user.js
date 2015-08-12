'use strict';

module.exports = function(app) {
  var user = require('../controllers/user');
  var authorization = require('../routes/middlewares/authorization.js');
  app.post('/user/search', authorization.requiresAdmin,user.searchCompanyForUser);
  app.post('/user/active', authorization.requiresAdmin,user.userModify);
  app.post('/user/team', authorization.requiresAdmin,user.userByTeam);
  app.post('/user/:userId/superadmin', function(req,res,next){console.log(req.session);next();},authorization.requiresAdmin, user.pointAdmin); //指定/取消大使
  app.get('/users/company/:companyId', authorization.requiresAdmin, user.getCompanyUser); //获取公司员工资料
};