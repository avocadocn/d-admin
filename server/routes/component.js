'use strict';
var authorization = require('./middlewares/authorization.js'),
        component = require('../controllers/component');
module.exports = function(app) {
    app.get('/component/componentList', authorization.requiresAdmin,component.componentList);
    app.post('/component/addComponent', authorization.requiresAdmin,component.addComponent);
    app.post('/component/activate', authorization.requiresAdmin,component.activateComponent);
    app.delete('/component/delete/:componentId', authorization.requiresAdmin,component.deleteComponent);

    // app.post('/component/deal', authorization.requiresAdmin,report.dealReport);
};