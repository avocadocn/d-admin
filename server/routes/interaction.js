'use strict';

module.exports = function(app) {
  var interaction = require('../controllers/interaction');
  var authorization = require('../routes/middlewares/authorization.js');
  app.get('/interaction/template', authorization.requiresAdmin,interaction.interactionTemplateHome);
}