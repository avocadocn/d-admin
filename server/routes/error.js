'use strict';

module.exports = function(app) {

    var error = require('../controllers/error');
    var authorization = require('../routes/middlewares/authorization.js');

    app.get('/error/errorList', authorization.requiresAdmin,error.getErrorStatics);
    app.post('/error/delete', authorization.requiresAdmin,error.deleteErrorItem);
};
