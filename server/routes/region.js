'use strict';

module.exports = function(app) {

    var region = require('../controllers/region');

    app.get('/region/province', region.getProvinceList);
    app.post('/region/city', region.getCityByProvince);
    app.post('/region/district', region.getDistrict);
    app.post('/region/company', region.getDistrict);

};
