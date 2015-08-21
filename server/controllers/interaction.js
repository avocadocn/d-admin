'use strict';

// mongoose models
var mongoose = require('mongoose'),
  Config = mongoose.model('Config');

exports.interactionTemplateHome = function(req, res) {
  res.render('system/interaction_template');
};