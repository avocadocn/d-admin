'use strict';

var mongoose = require('mongoose'),
  Admin = mongoose.model('Admin'),
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
  res.redirect('/#/mamager');
}

// 临时地初始化设置，以后需要移至别处。
exports.init = function(req, res) {
  var config = new Config({ name: 'admin', company_register_need_invite: true });
  config.save(function(err) {
    if (err) res.send({ r: err });
    else res.send({ r: 'init success' });
  });
};