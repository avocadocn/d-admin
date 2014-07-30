'use strict';

module.exports = function(app) {

    var message = require('../controllers/message');
    var authorization = require('../routes/middlewares/authorization.js');
    app.get('/message/sendlist', authorization.requiresAdmin,message.senderList);
    app.post('/message/sendlist', authorization.requiresAdmin,message.senderList);

    app.post('/message/send', authorization.requiresAdmin,message.adminSendToAll);
};