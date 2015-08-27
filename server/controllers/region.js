'use strict';

var mongoose = require('mongoose'),
  Region = mongoose.model('Region'),
  UUID = require('../kit/uuid');


function getProvinces(req,res) {
  Region.find(null,{'id':1,'name':1,'city':1},function (err, all) {
    if(err || !all) {
      return res.send('ERROR');
    } else {
      return res.send(all);
    }
  });
}
function getCities(req,res,id) {
  Region.findOne({'id':id},{'city':1},function (err, region) {
    if(err || !region) {
      return res.send('ERROR');
    } else {
      return res.send(region.city);
    }
  });
}
function getDistricts(req,res,pid,cid) {
  Region.findOne({
    'id':pid
    },function (err, region) {
    if(err || !region){
      return res.send('ERROR');
    } else {
      for(var i = 0; i < region.city.length; i ++) {
        if(region.city[i].id === cid) {
          return res.send(region.city[i].district);
        }
      }
      return res.send([]);
    }
  });
}

//获取所有省名字
exports.getProvinceList = function (req, res) {
  getProvinces(req,res);
};


//返回某省的所有城市
exports.getCityByProvince = function (req, res) {
  var province_id = req.body.province_id;
  getCities(req,res,province_id);
};


//返回某省某城市的所有区/县
exports.getDistrict = function (req, res) {
  var province_id = req.body.province_id;
  var city_id = req.body.city_id;
  getDistricts(req,res,province_id,city_id);
};


function getDistrictJSON(districts){
  var rst = [];
  for(var i = 0 ; i < districts.length; i ++) {
    rst.push({
      "label":districts[i].name,
      "value":districts[i].name
    });
  }
  return rst;
}

function getCityJSON(cities) {
  var rst = [];
  for(var i = 0;i<cities.length; i ++) {
    rst.push({
      "label":cities[i].name,
      "value":cities[i].name,
      "data":getDistrictJSON(cities[i].district)
    });
  }
  return rst;
}
exports.regionAsJSON = function(req, res) {
  var rst = {
    "data":[]
  }
  Region.find(null,function (err, regions) {
    if(err || !regions) {
      return res.send([]);
    } else {
      for(var i = 0; i < regions.length; i ++) {
        rst.data.push({
          "label":regions[i].name,
          "value":regions[i].name,
          "data":getCityJSON(regions[i].city)
        });
      }
      return res.send(rst);
    }
  });
};

exports._delete = function(req, res) {
  var _type = req.body._type;
  var pid = req.body.pid;
  var cid = req.body.cid;
  var id = req.body.id;

  switch(_type) {
    case 0:
      Region.remove({'id':id}, function(err, region) {
        if(err || !region) {
          return res.send([]);
        } else {
          return res.send('ok');
        }
      });
      break;
    case 1:
      Region.findOne({'id':pid}, function(err, region) {
        if(err || !region) {
          return res.send([]);
        } else {
          for(var i = 0; i < region.city.length; i++) {
            if (region.city[i].id === id) {
              region.city.splice(i,1);
              break;
            }
          }
          region.save(function(err) {
            if(err) {
              return res.send([]);
            } else {
              return res.send('ok');
            }
          });
        }
      })
      break;
    case 2:
      Region.findOne({'id':pid}, function(err,region) {
        if(err || !region) {
          return res.send([]);
        } else {
          for(var i = 0; i < region.city.length; i ++) {
            if(region.city[i].id == cid) {
              for(var j = 0; j < region.city[i].district.length; j++) {
                if (region.city[i].district[j].id === id) {
                  region.city[i].district.splice(j,1);
                  break;
                }
              }
              break;
            }
          }
          region.save(function(err) {
            if(err) {
              return res.send([]);
            } else {
              return res.send('ok');
            }
          })
        }
      })
      break;
    default:break;
  }
}


exports._edit = function(req, res) {
  var _type = req.body._type;
  var pid = req.body.pid;
  var cid = req.body.cid;
  var id = req.body.id;
  var name = req.body.name;

  switch(_type) {
    case 0:
      Region.update({'id':id}, {'$set':{'name':name}},function (err,region){
        if(err || !region){
          res.send({'result':0,'msg':'null'});
        }else{
          res.send({'result':1,'msg':'ok'});
        }
      });
      break;
    case 1:
      Region.findOne({'id':pid}, function(err, region) {
        if(err || !region) {
          return res.send([]);
        } else {
          for(var i = 0; i < region.city.length; i++) {
            if (region.city[i].id === id) {
              region.city[i].name = name;
              break;
            }
          }
          region.save(function(err) {
            if(err) {
              return res.send([]);
            } else {
              return res.send('ok');
            }
          });
        }
      })
      break;
    case 2:
      Region.findOne({'id':pid}, function(err,region) {
        if(err || !region) {
          return res.send([]);
        } else {
          for(var i = 0; i < region.city.length; i ++) {
            if(region.city[i].id == cid) {
              for(var j = 0; j < region.city[i].district.length; j++) {
                if (region.city[i].district[j].id === id) {
                  region.city[i].district[j].name = name;
                  break;
                }
              }
              break;
            }
          }
          region.save(function(err) {
            if(err) {
              return res.send([]);
            } else {
              return res.send('ok');
            }
          })
        }
      })
      break;
    default:break;
  }
}


exports.add = function(req, res) {
  var _type = req.body._type;
  var pid = req.body.pid;
  var cid = req.body.cid;
  var name = req.body.name;
  //var uuid = req.body.uuid;

  switch(_type) {
    case 0:
      var province = new Region();
      province.id = UUID.id();
      province.name = name;
      province.save(function(err) {
        if(err) {
          return res.send([]);
        } else {
          return res.send('ok');
        }
      });
      break;
    case 1:
      Region.findOne({'id':pid}, function(err, region) {
        if(err || !region) {
          return res.send([]);
        } else {
          region.city.push({
            'id':UUID.id(),
            'name':name
          });
          region.save(function(err) {
            if(err) {
              return res.send([]);
            } else {
              return res.send('ok');
            }
          });
        }
      })
      break;
    case 2:
      Region.findOne({'id':pid}, function(err,region) {
        if(err || !region) {
          return res.send([]);
        } else {
          for(var i = 0; i < region.city.length; i ++) {
            if(region.city[i].id == cid) {
              region.city[i].district.push({
                'id' :  UUID.id(),
                'name': name
              });
              break;
            }
          }
          region.save(function(err) {
            if(err) {
              return res.send([]);
            } else {
              return res.send('ok');
            }
          })
        }
      })
      break;
    default:break;
  }
}
