'use strict';

module.exports = function(app) {

    // Home route
    var index = require('../controllers/index');
    app.get('/', index.render);

    // 临时路由，用于创建一个临时的管理员
    app.get('/createAdmin', index.createAdminView);
    app.post('/createAdmin', index.createAdmin);

    app.get('/init', index.init);

};
