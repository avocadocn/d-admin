'use strict';

var mongoose = require('mongoose'),
  Admin = mongoose.model('Admin'),
  Config = mongoose.model('Config'),
  Company = mongoose.model('Company'),
  User = mongoose.model('User');;
var qr = require('qr-image'),
async = require('async'),
fs = require('fs'),
mkdirp = require('mkdirp');


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


exports.createAdminView = function(req, res) {
  res.render('create');
};

exports.createAdmin = function(req, res) {
  var admin = new Admin({
    email: 'service@donler.com',
    password: '55yali'
  });
  admin.save(function(err) {
    if (err) {
      console.log(err);
      res.render('create', { message: '创建失败' });
    } else {
      res.render('create', { message: '创建成功' });
    }
  });
};


exports.logout = function(req,res){
  //由于未知原因 req.user 无法存入数据库,暂时只能用session
  if(req.session.admin){
    req.session.destroy(function(err){
      console.log(err);
    });
  }
  req.logout();
  res.redirect('/login');
}


exports.login = function(req, res){
  var msg = {'msg':'登陆成功!'};
  if(req.params.status){
    switch(req.params.status){
      case 'failure':
        msg.msg = "用户名不存在或者密码错误!";
        res.render('login',msg);
        break;
      default:break;
    }
  }
}

exports.loginSuccess = function(req, res){
  //由于 req.user 无法存入数据库,暂时只能用session
  req.session.admin = {
    'name':req.user.email,
    'role':'admin'
  };
  res.redirect('/#/parameter');
}

// 临时地初始化设置，以后需要移至别处。
exports.init = function(req, res) {
  var config = new Config({ name: 'admin', company_register_need_invite: true });
  config.save(function(err) {
    if (err) res.send({ r: err });
    else res.send({ r: 'init success' });
  });
};

exports.getSMTP = function (req, res) {
  Config.findOne({ name: 'admin' }).exec()
  .then(function (config) {
    if (!config) {
      return res.send({ result: 0, msg: '获取失败' });
    }
    if (!config.smtp) {
      config.smtp = 'webpower';
      config.save(function (err) {
        if (err) {
          console.log(err);
          res.send({ result: 0, msg: '获取失败' });
        } else {
          res.send({ result: 1, smtp: config.smtp });
        }
      });
    } else {
      res.send({ result: 1, smtp: config.smtp });
    }
  })
  .then(null, function (err) {
    console.log(err);
    res.send({ result: 0, msg: '获取失败' });
  });
};

exports.setSMTP = function (req, res) {
  Config.findOne({ name: 'admin' }).exec()
  .then(function (config) {
    if (!config) {
      return res.send({ result: 0, msg: '设置失败' });
    }
    config.smtp = req.body.smtp;
    config.save(function (err) {
      if (err) {
        console.log(err);
        res.send({ result: 0, msg: '设置失败' });
      } else {
        res.send({ result: 1 });
      }
    })
  })
  .then(null, function (err) {
    console.log(err);
    res.send({ result: 0, msg: '设置失败' });
  });
};
var formatTimeDir = function () {
  var now = new Date()
  return now.getFullYear()+'-'+now.getMonth()+'/';
}
exports.generateQrcode = function (req, res) {
  Config.findOne({ name: 'admin' }).exec()
  .then(function (config) {
    if (!config) {
      return res.send({ result: 0, msg: '生成失败' });
    }
    Company.find().exec().then(function (companies) {
      var relativeDir = '../yali/public';
      var qrDir = '/img/qrcode/companyinvite/';
      var _formatDir = formatTimeDir();
      var finalRelativeDir =relativeDir + qrDir +_formatDir;
      var finalSaveDir = qrDir +_formatDir;
      var createQr = function () {
        async.each(companies, function(company, callback) {
          var inviteUrl = config.host.product+'/users/invite?key='+company.invite_key+'&cid=' + company._id;
          var qrImg = qr.image(inviteUrl, { type: 'png' });
          var fileName = company._id.toString()+'.png';
          var finalDir =finalRelativeDir+fileName;
          var stream = fs.createWriteStream(finalDir)
          company.invite_qrcode = finalSaveDir+fileName;
          company.save(function (err) {
            if(err){
              console.log(err);
            }
          });
          stream.on('error', function (error) {
            // console.log("Caught", error);
            callback(error);
          });
          qrImg.pipe(stream);
          callback();
        }, function(err){
          if( err ) {
            console.log(err);
            res.send({ result: 0, msg: '生成失败' });
          } else {
            res.send({ result: 1, msg: '生成成功' });
          }
        });
      }
      fs.exists(finalRelativeDir, function (isExists) {
        if (isExists) {
          createQr();
        }
        else {
          mkdirp(finalRelativeDir, createQr);
        }
      });
      
      
    })
    .then(null,function (err) {
      console.log(err);
      res.send({ result: 0, msg: '生成失败' });
    })
  })
  .then(null, function (err) {
    console.log(err);
    res.send({ result: 0, msg: '生成失败' });
  });
  
};




