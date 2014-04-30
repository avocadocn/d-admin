'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var _company = new Schema({
    id: String,
    name: String,
    //是否激活
    status: {
        active: {
            type: Boolean,
            default: false
        },

        date: Number         //截止时间,超过此时间还不激活则需要重新激活
    },
    register_date: {
        type: Date,
        default: Date.now()
    }
});

var _county = new Schema({
    id: String,
    name: String,
    company: [_company]      //按县划分的公司
});

var _city = new Schema({
    id: String,
    name: String,
    county: [_county],
    company: [_company]      //按市划分的公司,和县无关
});


var _province = new Schema({
    id: String,
    name: String,
    city: [_city],
    company: [_company]      //按省划分的公司,与市和县无关
});

var RegionSchema = new Schema({
    province: [_province]
});



mongoose.model('Region', RegionSchema);