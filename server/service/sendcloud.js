'use strict';

var mailer = require('nodemailer'),
    jade = require('jade'),
    fs = require('fs'),
    error = require('../controllers/error'),
    rootConfig = require('../config/config'),
    encrypt = require('../kit/encrypt');

// var MAIL_OPTION = {
//     host: 'smtp.ym.163.com',
//     auth: {
//         user: 'nicoJiang@55yali.com',
//         pass: '~!jzl1234'
//     }
// };

var MAIL_OPTION = {
  host: 'smtpcloud.sohu.com',
  secureConnection: false,
  port: 25,
  auth: {
    user: 'donler_test_mail',
    pass: '4rcopeKXX9VJrhbN'
  }
};

var transport = mailer.createTransport('SMTP', MAIL_OPTION);

var SECRET = 'c011fd597b3e';

var CONFIG_NAME = 'donler';

var siteProtocol = 'http://';

/**
 * Send an email
 * @param {Object} data 邮件对象
 * @param {Object} target 出错时记录的目标对象
 */
var sendMail = function (data,target,err_type) {
  transport.sendMail(data, function (err) {
    if (err) {
      error.addErrorItem(target,err_type,err);
      // 写为日志
      console.log(err_type,err);
    }
  });
};


/**
 * 发送激活通知邮件
 * @param {String} who 接收人的邮件地址
 * @param {String} name 公司名
 * @param {String} id HR的公司id
 */
exports.sendCompanyActiveMail = function (who, name, id, host) {
  var from = '动梨<service@donler.com>';
  var to = who;
  var subject = name + ' 动梨账号激活';
  var description = '我们收到您在动梨的申请信息，请点击下面的链接来激活帐户：';
  var link = 'http://' + host + '/company/validate?key=' + encrypt.encrypt(id,SECRET) + '&id=' + id;

  fs.readFile(rootConfig.root + '/server/views/partials/mailTemplate.jade', 'utf8', function(err, data) {
    if (err) throw err;
    var fn = jade.compile(data);
    var html = fn({
      'title': '注册激活',
      'host': siteProtocol + host,
      'who': who,
      'description': description,
      'link': link
    });
    sendMail({
      from: from,
      to: to,
      subject: subject,
      html: html
    }, {
      type: 'company',
      _id: id,
      name: name,
      email: who
    }, 'COMPANY_CREATE_EMAIL_SEND_ERROR');
  });
};