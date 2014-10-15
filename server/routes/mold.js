'use strict';

module.exports = function(app) {

    var authorization = require('./middlewares/authorization.js'),
        mold = require('../controllers/mold');

    app.get('/mold/home', authorization.requiresAdmin,mold.home);
    // app.get('/component/get/:report_status', authorization.requiresAdmin,report.pullReport);
    // app.post('/component/contentDetail', authorization.requiresAdmin,report.getReportDetail);
    // app.post('/component/deal', authorization.requiresAdmin,report.dealReport);
};