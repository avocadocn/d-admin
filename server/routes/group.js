'use strict';

var authorization = require('../routes/middlewares/authorization.js');
var groupApiCtrl = require('../controllers/group.js');

module.exports = function (app) {
  app.get('/groups', authorization.requiresAdmin, groupApiCtrl.getGroups);
};