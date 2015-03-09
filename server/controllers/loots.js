'use strict';

var mongoose = require('mongoose'),
    Stadium = mongoose.model('Stadium');

exports.renderLoots = function (req, res) {
  res.render('system/loots');
};

//获取符合条件的所有stadiums
exports.getLoots = function (req, res) {
  var options = {};
  if(req.query.term) options.term = req.query.term;
  // if(req.query.stadium) options.stadium = new RegExp(req.query.stadium);
  Loot.find(options)
  .populate('stadium', {'name':1})
  .exec()
  .then(function(loots) {
    return res.status(200).send({loots: loots});
  })
  .then(null, function(err) {
    console.log(err);
    return res.status(500).send({msg: '查找失败'});
  })
};

exports.getLoot = function (req, res) {
  Loot.findOne({'_id': req.params.lootId}, function(err, loot) {
    if(err||!loot) {
      return res.status(500).send({msg: '查找失败'});
    }
    else {
      return res.status(200).send({loot: loot});
    }
  });
};

exports.createLoot = function (req, res) {
  var loot = new Loot({
    stadium: req.body.stadium,
    site: req.body.site,
    content: req.body.content,
    group_type: req.body.groupType,
    campaign_start_time: req.body.campaignStartTime,
    campaign_end_time: req.body.campaignEndTime,    //这个场地的活动结束时间
    loot_start_time: req.body.lootStartTime,        //抢购开始时间
    loot_end_time: req.body.lootEndTime,            //抢购结束时间
    term: req.body.term,//属于哪一期
    loot_number: req.body.lootNumber
  });
  loot.save(function(err) {
    if(err) {
      console.log(err);
      return res.status(500).send({msg: '保存失败'});
    }
    else {
      return res.status(200).send({msg: '保存成功'});
    }
  });
};

exports.editLoot = function (req, res) {
  Loot.findOne({'_id': req.params.lootId}, function(err, stadium) {
    if(err||!loot) {
      return res.status(500).send({msg: '查找失败'});
    }
    else {
      if(req.body.stadium) loot.stadium = req.body.stadium;
      if(req.body.site) loot.location = req.body.location;
      if(req.body.content) loot.group_type = req.body.group_type;
      if(req.body.group_type) loot.group_type = req.body.group_type;
      if(req.body.campaign_start_time) loot.campaign_start_time = req.body.campaign_start_time;
      if(req.body.campaign_end_time) loot.campaign_end_time = req.body.campaign_end_time;
      if(req.body.loot_start_time) loot.loot_start_time = req.body.loot_start_time;
      if(req.body.loot_end_time) loot.loot_end_time = req.body.loot_end_time;
      if(req.body.loot_number) loot.loot_number = req.body.loot_number;
      if(req.body.status) loot.status = req.body.status;
      loot.save(function(err) {
        if(err) {
          return res.status(500).send({msg: '保存失败'});
        }else {
          return res.status(200).send({msg: '保存成功'});
        }
      });
    }
  });
};
