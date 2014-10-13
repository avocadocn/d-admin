'use strict';

var mongoose = require('mongoose');

exports.home = function (req ,res){
  res.render('system/component');
};