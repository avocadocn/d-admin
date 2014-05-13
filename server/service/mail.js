'use strict';

var mailer = require('nodemailer'),
    encrypt = require('../kit/encrypt');

var MAIL_OPTION = {
    host: 'smtp.ym.163.com',
    secureConnection: true, // use SSL
    port: 994, // port for secure SMTP  默认端口号:25  SSL端口号:994
    auth: {
        user: 'nicoJiang@55yali.com',
        pass: '~!jzl1234'
    }
};

var transport = mailer.createTransport('SMTP', MAIL_OPTION);

var SECRET = '18801912891';

var CONFIG_NAME = 'donler';

/**
 * Send an email
 * @param {Object} data 邮件对象
 */
var sendMail = function (data) {
  transport.sendMail(data, function (err) {
    if (err) {
      // 写为日志
      console.log(err);
    }
  });
};


exports.sendCompanyActiveMail = function (who, name, id, host) {
  var from = '动梨无限<nicoJiang@55yali.com>';
  var to = who;
  var subject = name + ' 动梨社区公司账号激活';
  var html = '<p>您好：<p/>' +
    '<p>我们收到您在动梨的申请信息，请点击下面的链接来激活帐户：</p>' +
    '<a href="http://' + host + '/company/validate?key=' + encrypt.encrypt(id,SECRET) + '&id=' + id + '">激活链接</a>';
  sendMail({
    from: from,
    to: to,
    subject: subject,
    html: html
  });
};