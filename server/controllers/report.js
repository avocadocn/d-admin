//举报功能

'use strict';

var mongoose = require('mongoose'),
    Report = mongoose.model('Report');

exports.home = function  (req, res) {
  res.render('system/report');
}
exports.pullReport = function  (req, res) {
  Report.find({'status':'verifying'}).sort({'create_date':-1}).limit(100).exec(function(err,reports){
    if(err || !reports){
      res.send({'msg':'ERROR_FETCH_FAILED','result':0});
    }else{
      res.send({'msg':'ERROR_FETCH_SUCCESS','result':1,'reports':reports});
    }
  });
}

exports.dealReport = function  (req, res) {
  var _status;
  if(req.body.flag == true){
    _status = 'active';
  }
  else{
    _status = 'inactive';
  }
  Report.findOne({'status':'verifying',_id:req.body._id}).exec(function(err,report){
    if(err || !report){
      res.send({'msg':'ERROR_FETCH_FAILED','result':0});
    }else{
      report.status = _status;
      report.save(function(err){
        if(!err){
          console.log(report);
          if(_status==='active'&&report.host_type==='comment'){
            mongoose.model('Comment').findOne({
              _id: report.host_id
            }).exec()
            .then(function (comment) {
              console.log(comment);
              if (comment) {
                comment.status = 'shield';
                comment.save(function (err) {
                if (err) {
                  console.log(err);
                  return res.send({'msg':'ERROR_FETCH_FAILED','result':0});
                } else {
                  return res.send({'msg':'ERROR_FETCH_SUCCESS','result':1});
                }
              });
              }
              else{
                console.log(err);
                return res.send({'msg':'ERROR_FETCH_FAILED','result':0});
              }
            })
            .then(null, function (err) {
              console.log(err);
              return res.send({'msg':'ERROR_FETCH_FAILED','result':0});
            });
          }
          else{
            return res.send({'msg':'ERROR_FETCH_SUCCESS','result':1});
          }
        }
        else{
          console.log(err);
          return res.send({'msg':'ERROR_FETCH_FAILED','result':0});
        }
      });
    }
  });
}