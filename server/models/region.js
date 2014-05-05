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

var _district = new Schema({
    id: String,
    name: String,
    company: [_company]      //按县或者区划分的公司
});

var _city = new Schema({
    id: String,
    name: String,
    district: [_district],
    company: [_company]      //按市划分的公司,和县无关
});


var Province = new Schema({
    id: String,
    name: String,
    city: [_city],
    company: [_company]      //按省划分的公司,与市和县无关
});



mongoose.model('Region', Province);