'use strict';

module.exports = function(app) {

    var region = require('../controllers/region');

    app.get('/region/province', region.getProvinceList);
    app.post('/region/city', region.getCityByProvince);
    app.post('/region/district', region.getDistrict);

    app.post('/region/add/province', region.add);
    app.post('/region/add/city', region.add);
    app.post('/region/add/district', region.add);

    app.post('/region/delete/province', region._delete);
    app.post('/region/delete/city', region._delete);
    app.post('/region/delete/district', region._delete);


    app.get('/region/json', region.regionAsJSON);
};
