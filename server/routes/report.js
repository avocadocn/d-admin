'use strict';

module.exports = function(app) {

    var authorization = require('../routes/middlewares/authorization.js'),
        report = require('../controllers/report');

    app.get('/report/home', authorization.requiresAdmin,report.home);
    app.get('/report/get/:report_type/:report_status', authorization.requiresAdmin,report.pullReport);
    app.post('/report/contentDetail', authorization.requiresAdmin,report.getReportDetail);
    app.post('/report/deal', authorization.requiresAdmin,report.dealReport);
};