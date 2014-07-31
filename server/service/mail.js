'use strict';

var mailer = require('nodemailer'),
    jade = require('jade'),
    fs = require('fs'),
    rootConfig = require('../config/config'),
    encrypt = require('../kit/encrypt');

var MAIL_OPTION = {
    host: 'smtp.ym.163.com',
    auth: {
        user: 'nicoJiang@55yali.com',
        pass: '~!jzl1234'
    }
};

// var MAIL_OPTION = {
//     host: 'smtp.ym.163.com',
//     auth: {
//         user: 'service@donler.com',
//         pass: '55yali'
//     }
// };

var transport = mailer.createTransport('SMTP', MAIL_OPTION);

var SECRET = '18801912891';

var CONFIG_NAME = 'donler';

var siteProtocol = 'http://';

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


/**
 * 发送激活通知邮件
 * @param {String} who 接收人的邮件地址
 * @param {String} name 公司名
 * @param {String} id HR的公司id
 */
exports.sendCompanyActiveMail = function (who, name, id, host) {
  var from = '动梨无限<service@donler.com>';
  var to = who;
  var subject = name + ' 动梨社区公司账号激活';
  var content = '<p>我们收到您在动梨的申请信息，请点击下面的链接来激活帐户：</p>' +
    '<a style="text-decoration: none; word-break: break-all;" href="http://' + host + '/company/validate?key=' + encrypt.encrypt(id,SECRET) + '&id=' + id + '">http://' + host + '/company/validate?key=' + encrypt.encrypt(id,SECRET) + '&id=' + id + '</a>';

    fs.readFile(rootConfig.root+'/server/views/partials/mailTemplate.jade', 'utf8', function (err, data) {
        if (err) throw err;
        var fn = jade.compile(data);
        var html = fn({'title':'注册激活','host':siteProtocol+host,'who':who,'content':content});
        sendMail({
          from: from,
          to: to,
          subject: subject,
          html: html
        });
    });
};