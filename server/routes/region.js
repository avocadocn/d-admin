'use strict';

module.exports = function(app) {

    var region = require('../controllers/region');
    var authorization = require('../routes/middlewares/authorization.js');

    app.get('/region/province', authorization.requiresAdmin,region.getProvinceList);
    app.post('/region/city', authorization.requiresAdmin,region.getCityByProvince);
    app.post('/region/district', authorization.requiresAdmin,region.getDistrict);

    app.post('/region/add/province', authorization.requiresAdmin,region.add);
    app.post('/region/add/city', authorization.requiresAdmin,region.add);
    app.post('/region/add/district', authorization.requiresAdmin,region.add);

    app.post('/region/delete/province', authorization.requiresAdmin,region._delete);
    app.post('/region/delete/city', authorization.requiresAdmin,region._delete);
    app.post('/region/delete/district', authorization.requiresAdmin,region._delete);

    app.post('/region/edit/province', authorization.requiresAdmin,region._edit);
    app.post('/region/edit/city', authorization.requiresAdmin,region._edit);
    app.post('/region/edit/district', authorization.requiresAdmin,region._edit);

    app.get('/region/json', authorization.requiresAdmin,region.regionAsJSON);
};
