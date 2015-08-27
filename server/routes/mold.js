'use strict';
var authorization = require('./middlewares/authorization.js'),
    mold = require('../controllers/mold');
module.exports = function(app) {
  app.get('/mold/moldList', authorization.requiresAdmin,mold.moldList);
  app.post('/mold/addMold', authorization.requiresAdmin,mold.addMold);
  app.post('/mold/activate', authorization.requiresAdmin,mold.activate);
  app.post('/mold/saveMold', authorization.requiresAdmin,mold.saveMold);
  app.delete('/mold/delete/:moldId', authorization.requiresAdmin,mold.deleteMold);
  app.get('/mold/editMold/:moldId', authorization.requiresAdmin,mold.editMold);
};