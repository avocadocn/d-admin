'use strict';

module.exports = function(app,passport) {
    var index = require('../controllers/index');
    // Home route
    app.get('/', index.render);

    app.get('/login', index.login);

};
