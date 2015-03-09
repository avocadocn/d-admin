'use strict';

var mongoose = require('mongoose'),
    Stadium = mongoose.model('Stadium');

exports.renderStadiums = function (req, res) {
  res.render('system/stadium');
};

//获取符合条件的所有stadiums
exports.getStadiums = function (req, res) {
  var options = {};
  if(req.query.district) options.location.district = req.query.district;
  if(req.query.city) options.location.city = req.query.city;
  if(req.query.province) options.location.province = req.query.province;
  // if(req.query.name) options.name = req.query.province;
  // 突然想起来 貌似前台可以过滤。。。
  Stadium.find(options, function(err, stadiums) {
    if(err) {
      console.log(err);
      return res.status(500).send({msg: '查找失败'});
    }
    else {
      return res.status(200).send({stadiums: stadiums});
    }
  })
};

exports.getStadium = function (req, res) {
  Stadium.findOne({'_id': req.params.stadiumId}, function(err, stadium) {
    if(err||!stadium) {
      return res.status(500).send({msg: '查找失败'});
    }
    else {
      return res.status(200).send({stadium: stadium});
    }
  });
};

exports.createStadiums = function (req, res) {
  var stadium = new Stadium({
    name: req.body.name,
    location: req.body.location,
    group_type: req.body.groupType,
    introduce: req.body.introduce
  });
  stadium.save(function(err) {
    if(err) {
      console.log(err);
      return res.status(500).send({msg: '保存失败'});
    }
    else {
      return res.status(200).send({msg: '保存成功'});
    }
  });
};

exports.editStadiums = function (req, res) {
  Stadium.findOne({'_id': req.params.stadiumId}, function(err, stadium) {
    if(err||!stadium) {
      return res.status(500).send({msg: '查找失败'});
    }
    else {
      if(req.body.name) stadium.name = req.body.name;
      if(req.body.location) stadium.location = req.body.location;
      if(req.body.group_type) stadium.group_type = req.body.group_type;
      if(req.body.introduce) stadium.introduce = req.body.introduce;
      if(req.body.status) stadium.status = req.body.status;
      stadium.save(function(err) {
        if(err) {
          return res.status(500).send({msg: '保存失败'});
        }else {
          return res.status(200).send({msg: '保存成功'});
        }
      });
    }
  });
};
