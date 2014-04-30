'use strict';


// mongoose models
var mongoose = require('mongoose'),
  Config = mongoose.model('Config');


exports.settingView = function(req, res) {
  res.render('system/setting');
};

exports.setNeedCompanyRegisterInviteCode = function(req, res) {
  var need = true;
  if (req.body.company_register_invite_code === 'true') {
    need = true;
  } else {
    need = false;
  }
  Config.findOne({ name: 'donler' })
  .exec(function(err, config) {
    config.company_register_need_invite = need;
    config.save(function(err) {
      if (err) {
        console.log(err);
        res.send({ result: 0, msg: '保存失败' });
      } else {
        res.send({ result: 1, msg: '保存成功' });
      }
    });
  });
};