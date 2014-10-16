'use strict';

module.exports = function(app) {

    var authorization = require('./middlewares/authorization.js'),
        mold = require('../controllers/mold');

    app.get('/mold/home', authorization.requiresAdmin,mold.home);
    app.get('/mold/moldList', authorization.requiresAdmin,mold.moldList);
    app.post('/mold/addMold', authorization.requiresAdmin,mold.addMold);
    app.post('/mold/activate', authorization.requiresAdmin,mold.activate);
    app.post('/mold/saveMolds', authorization.requiresAdmin,mold.saveMolds);
    app.delete('/mold/delete/:moldId', authorization.requiresAdmin,mold.delete);
};