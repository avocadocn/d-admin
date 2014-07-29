'use strict';


// mongoose models
var mongoose = require('mongoose'),
  Config = mongoose.model('Config'),
  CompanyRegisterInviteCode = mongoose.model('CompanyRegisterInviteCode');


exports.getCode = function(req,res){
  CompanyRegisterInviteCode
  .find().sort({'_id':-1})
  .exec(function(err, codes) {
    return res.send({result:1, codes: codes });
  });
}

exports.settingView = function(req, res) {
  CompanyRegisterInviteCode
  .find().sort({'_id':-1})
  .exec(function(err, codes) {
    res.render('system/setting', { codes: codes });
  });

};

exports.getCodeSwitch = function(req, res){
  Config.findOne({ name: 'admin' })
  .exec(function(err, config) {
    if(err || !config){
      return res.send({ result: 0, msg: '获取失败' });
    }else{
      if(config.company_register_need_invite != undefined && config.company_register_need_invite != null){
        return res.send({ result: 1, value: config.company_register_need_invite });
      }else{
        return res.send({ result: 0, msg: '获取失败' });
      }
    }
  });
}

exports.setNeedCompanyRegisterInviteCode = function(req, res) {
  var need = req.body.company_register_invite_code;
  Config.findOne({ name: 'admin' })
  .exec(function(err, config) {
    config.company_register_need_invite = need;
    config.save(function(err) {
      if (err) {
        console.log(err);
        res.send({ result: 0, msg: '保存失败' });
      } else {
        res.send({ result: 1, msg: '保存成功', value:need });
      }
    });
  });
};

exports.createCompanyRegisterInviteCode = function(req, res) {
  var companyRegisterInviteCode = new CompanyRegisterInviteCode();
  companyRegisterInviteCode.save(function(err) {
    if (err) {
      return res.send({ result: 0, msg: '添加失败' });
    } else {
      exports.getCode(req,res);
    }
  });
};