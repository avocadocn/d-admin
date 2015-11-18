//举报功能

'use strict';

var mongoose = require('mongoose'),
    Report = mongoose.model('Report');
exports.pullReport = function  (req, res) {
  Report.aggregate()
  .match({'status': req.params.report_status,'host_type':req.params.report_type})
  // .project({"_id":0,'host_type'})
  .group({_id : { id:"$host_id",
                  host_type: "$host_type",
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
        // console.log(result);
        return res.send({'msg':'FETCH_SUCCESS','result':1,'reports':result});
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
  switch(req.body.host_type) {
    case 'user':
      hostModel = 'User';
      break;
    case 'circle':
      hostModel = 'CircleContent';
      break;
    case 'activity':
    case 'poll':
    case 'question':
      hostModel = 'Interaction';
      break;
    default:
      return res.send({'msg':'ERROR_FETCH_FAILED','result':0});
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
    .then(function (reportModel) {
      if (reportModel) {
        switch(req.body.host_type) {
          case 'user':
            reportModel.disabled = true;
            break;
          case 'circle':
            reportModel.status = 'shield';
            break;
          case 'activity':
          case 'poll':
          case 'question':
            reportModel.status = 4;
            break;
          default:
            return res.send({'msg':'ERROR_FETCH_FAILED','result':0});
        }
        reportModel.save(function (err) {
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
exports.getReportDetail = function(req, res){
  var hostModel;
  switch(req.body.host_type) {
    case 'user':
      hostModel = 'User';
      break;
    case 'circle':
      hostModel = 'CircleContent';
      break;
    case 'activity':
    case 'poll':
    case 'question':
      hostModel = 'Interaction';
      break;
    default:
      return res.send({'msg':'ERROR_FETCH_FAILED','result':0});
  }
  mongoose.model(hostModel).findOne({
      _id: req.body.host_id
    }).exec()
    .then(function (host) {
      if (host) {
        if(req.body.host_type==='user'){
          mongoose.model('Comment').find({
            'poster._id': req.body.host_id
          }).exec()
          .then(function (comments) {
            host.set('comments',comments,{strict:false});
            return res.send({'msg':'FETCH_SUCCESS','result':1,content:host});
          });
        }
        else{
          return res.send({'msg':'FETCH_SUCCESS','result':1,content:host});
        }

      }
      else{
        return res.send({'msg':'ERROR_FETCH_FAILED','result':0});
      }
    })
    .then(null, function (err) {
      console.log(err);
      return res.send({'msg':'ERROR_FETCH_FAILED','result':0});
    });
}