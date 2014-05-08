'use strict';

var mongoose = require('mongoose'),
  Region = mongoose.model('Region');


//获取所有省名字
exports.getProvinceList = function (req, res) {
  Region.find(null,{'id':1,'name':1},function (err, all) {
    if(err || !all) {
      return res.send('ERROR');
    } else {
      return res.send(all);
    }
  });
};


//返回某省的所有城市
exports.getCityByProvince = function (req, res) {
  var province = req.body.province;
  Region.findOne({'name':province},{'city':1},function (err, region) {
    if(err || !region) {
      return res.send('ERROR');
    } else {
      return res.send(region.city);
    }
  });
};


/*
exports.getCityById = function (req, res, id) {
  Region.findOne({'province' : {'$elemMatch':{'id':id}}},function (err, region) {

  });
};
*/


//返回某省某城市的所有区/县
exports.getDistrict = function (req, res) {
  var province = req.body.province;
  var city = req.body.city;
  Region.findOne({
    'name':province,
    'city' : {'$elemMatch':{'name':city}},
    },
    {'city':1},function (err, region) {
    if(err || !region){
      return res.send('ERROR');
    } else {
      for(var i = 0; i < region.city.length; i ++) {
        if(region.city[i].name === city) {
          return res.send(region.city[i].district);
        }
      }
      return res.send([]);
    }
  });
};


//返回某省某城市某区的公司
exports.getDistrict = function (req, res) {
  var province = req.body.province;
  var city = req.body.city;
  var district = req.body.district;
  Region.findOne({
    'name':province,
    'city' : {
      '$elemMatch':{
        'name':city,
        'district':{
          '$elemMatch':{
            'name':district
            }
          }
        }
      },
    },
    {'city':1},function (err, company) {
    if(err || !district){
      return res.send('ERROR');
    } else {
      for(var i = 0; i < region.city.length; i ++) {
        if(region.city[i].name === city) {
          for(var j = 0; j < region.city[i].district.length; j ++) {
            if(region.city[i].district[j].name === district) {
              return res.send(region.city[i].district[j].company);
            }
          }
        }
      }
      return res.send([]);
    }
  });
};