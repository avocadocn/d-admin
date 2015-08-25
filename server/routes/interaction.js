'use strict';
var interaction = require('../controllers/interaction');
var authorization = require('../routes/middlewares/authorization.js');
var multerService = require('../service/multerService.js');
module.exports = function(app) {
  app.get('/interaction/template/home', authorization.requiresAdmin,interaction.interactionTemplateHome);
  app.post('/interaction/template', multerService.upload('interaction').array('photo',9), interaction.templateFormFormat, interaction.createTemplateValidate, interaction.createTemplate)  //发模板
  app.get('/interaction/template', interaction.getTemplateList);
}