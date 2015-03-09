'use strict';

var mongoose = require('mongoose'),
  Group = mongoose.model('Group');

exports.getGroups = function (req, res) {
  Group.find({
    active: true
  }).exec()
    .then(function (groups) {
      res.send({groups: groups});
    })
    .then(null, function (err) {
      console.log(err.stack || err);
      res.send(500, {msg: '服务器错误'});
    });
};