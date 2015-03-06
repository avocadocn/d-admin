'use strict';

module.exports = function(app) {
  var termCtrl = require('../controllers/term.js');
  var authorization = require('../routes/middlewares/authorization.js');

  app.post('/terms', authorization.requiresAdmin, termCtrl.createTerm);
  app.put('/terms/:termId', authorization.requiresAdmin, termCtrl.editTerm);
};