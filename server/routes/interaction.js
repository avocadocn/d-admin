'use strict';
var interaction = require('../controllers/interaction');
var authorization = require('../routes/middlewares/authorization.js');
var multerService = require('../service/multerService.js');
module.exports = function(app) {
  app.post('/interaction/template', authorization.requiresAdmin, multerService.upload('interaction').array('photo',9), interaction.templateFormFormat, interaction.createTemplateValidate, interaction.createTemplate)  //发模板
  app.get('/interaction/template', authorization.requiresAdmin, interaction.getTemplateList);
  app.get('/interaction', authorization.requiresAdmin, interaction.getInteractionList);
  app.get('/interaction/template/:templateType/:templateId', authorization.requiresAdmin, interaction.getTemplateDetail);
  app.delete('/interaction/template/:templateType/:templateId', authorization.requiresAdmin, interaction.colseTemplate);
  app.put('/interaction/template/:templateType/:templateId', authorization.requiresAdmin, interaction.openTemplate);
}