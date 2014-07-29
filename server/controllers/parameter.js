'use strict';

var mongoose = require('mongoose'),
  Admin = mongoose.model('Admin'),
  CompanyRegisterInviteCode = mongoose.model('CompanyRegisterInviteCode'),
  Config = mongoose.model('Config');



exports.getHost = function(req, res) {
  Config.findOne({'name':'admin'},function (err, config) {
    if(err || !config) {
      return res.send([]);
    } else {
      return res.send(config.host);
    }
  });
};

exports.setHost = function(req, res) {
  var type = req.body.host_type;
  var host = req.body.host_value;
  Config.findOne({'name':'admin'},function (err,config) {
    if(err || !config) {
      if(!config) {
        var config = new Config();
        config.name = 'admin';
        switch(type) {
          case 0:
            config.host.admin = host;
            break;
          case 1:
            config.host.product = host;
            break;
          default:break;
        }
        config.save(function(err) {
          return res.send(err ? 'ERR' : 'ok');
        });
      }
      return res.send('ERR');
    } else {
      switch(type) {
        case 0:
          config.host.admin = host;
          break;
        case 1:
          config.host.product = host;
          break;
        default:break;
      }
      config.save(function(err) {
        return res.send(err ? 'ERR' : 'ok');
      });
    }
  });
};


exports.home = function(req, res) {
  CompanyRegisterInviteCode
  .find()
  .exec(function(err, codes) {
    res.render('system/parameter', { codes: codes });
  });
};
