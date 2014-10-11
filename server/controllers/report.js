//举报功能

'use strict';

var mongoose = require('mongoose'),
    Report = mongoose.model('Report');

exports.home = function  (req, res) {
  res.render('system/report');
}
exports.pullReport = function  (req, res) {
  Report.aggregate()
  .match({'status': req.params.report_status})
  // .project({"_id":0,'host_type'})
  .group({_id : { id:"$host_id",
                  host_type: "$host_type",
                  content: "$content",
                  status:"$status"
                },
          report_type : {$addToSet:"$report_type"},
          number: { $sum : 1}
        })
  .sort({number:-1})
  .limit(100)
  .exec(function(err,result){
      if (err) {
        console.log(err);
        res.send({'msg':'ERROR_FETCH_FAILED','result':0});
      }
      else{
        console.log(result);
        return res.send({'msg':'ERROR_FETCH_SUCCESS','result':1,'reports':result});
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
  var hostModel;
  if(req.body.host_type==='comment'){
    hostModel ='Comment';
  }
  Report.update({'status':'verifying','host_type': req.body.host_type,'host_id':req.body.host_id},{$set:{'status':_status}},{multi: true},function(err,num){
    if(err){
      console.log(err);
    }
  });
  if(_status==='active'){
    mongoose.model(hostModel).findOne({
      _id: req.body.host_id
    }).exec()
    .then(function (comment) {
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