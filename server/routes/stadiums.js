'use strict';

module.exports = function(app) {

  var authorization = require('../routes/middlewares/authorization.js'),
      stadiums = require('../controllers/stadiums');

  app.get('/stadiums/home', authorization.requiresAdmin, stadiums.renderStadiums);
  app.get('/stadiums/list', authorization.requiresAdmin, stadiums.getStadiums);
  app.get('/stadiums/:stadiumId', authorization.requiresAdmin, stadiums.getStadium);
  app.post('/stadiums', authorization.requiresAdmin, stadiums.createStadiums);
  app.put('/stadiums/:stadiumId', authorization.requiresAdmin, stadiums.editStadiums);
};