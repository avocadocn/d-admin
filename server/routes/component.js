'use strict';

module.exports = function(app) {

    var authorization = require('./middlewares/authorization.js'),
        component = require('../controllers/component');

    app.get('/component/home', authorization.requiresAdmin,component.home);
    app.get('/component/componentList', authorization.requiresAdmin,component.componentList);
    app.post('/component/addComponent', authorization.requiresAdmin,component.addComponent);
    app.post('/component/activate', authorization.requiresAdmin,component.activateComponent);
    app.delete('/component/delete/:componentId', authorization.requiresAdmin,component.deleteComponent);

    // app.post('/component/deal', authorization.requiresAdmin,report.dealReport);
};