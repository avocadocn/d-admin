'use strict';

var mongoose = require('mongoose'),
  CampaignModule = mongoose.model('CampaignModule');

exports.home = function (req, res){
  res.render('system/component');
};

exports.componentList = function (req, res) {
  CampaignModule.find(null,function(err,modules){
    if(err||!modules){
      console.log(err);
      return res.send({'result':0,'msg':'查找失败!'});
    }
    else
      return res.send(modules);
  })
};

exports.addComponent = function (req, res) {
  var module = new CampaignModule({
    name:req.body.name,
    note:req.body.note
  });
  module.save(function(err){
    if(err){
      console.log(err);
      return res.send(500,{'result':0,'msg':'保存失败!'+err});
    }
    else{
      return res.send({'result':1,'msg':'保存成功!'});
    }
  });
};

exports.activateComponent = function (req, res) {
  CampaignModule.update({'_id':req.body.id},{'$set':{'enable':req.body.value}},function(err,module){
    if(err||!module){
      console.log(err);
      return res.send({'result':0,'msg':'查找失败!'});
    }
    else{
      return res.send({'result':1,'msg':'禁用成功'})
    }
  });
};

exports.deleteComponent = function (req, res) {
  CampaignModule.remove({'_id':req.params.componentId},function(err){
    if(err){
      console.log(err);
      return res.send({'result':0,'msg':'删除失败!'});
    }
    else{
      return res.send({'result':1,'msg':'删除成功'})
    }
  })
}