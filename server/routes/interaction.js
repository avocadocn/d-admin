'use strict';
var interaction = require('../controllers/interaction');
var authorization = require('../routes/middlewares/authorization.js');
module.exports = function(app) {
  app.get('/interaction/template', authorization.requiresAdmin,interaction.interactionTemplateHome);
}