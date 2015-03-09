'use strict';

module.exports = function(app) {

  var authorization = require('../routes/middlewares/authorization.js'),
      loots = require('../controllers/loots');

  app.get('/loots/home', authorization.requiresAdmin, loots.renderLoots);
  app.get('/loots/list', authorization.requiresAdmin, loots.getLoots);
  app.get('/loots/:lootId', authorization.requiresAdmin, loots.getLoot);
  app.post('/loots', authorization.requiresAdmin, loots.createLoot);
  app.put('/loots/:lootId', authorization.requiresAdmin, loots.editLoot);
};