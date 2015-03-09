'use strict';

var questionApiCtrl = require('../controllers/question.js');
var authorization = require('../routes/middlewares/authorization.js');

module.exports = function (app) {
  app.post('/questions', authorization.requiresAdmin, questionApiCtrl.createQuestion);
  app.put('/questions/:questionId', authorization.requiresAdmin, questionApiCtrl.editQuestion);
  app.get('/questions', authorization.requiresAdmin, questionApiCtrl.getQuestionList);
  app.get('/questions/templates/manager', authorization.requiresAdmin, questionApiCtrl.renderMangerTemplateView);
};