'use strict';

var mongoose = require('mongoose'),
  CampaignModule = mongoose.model('CampaignModule'),
  CampaignMold = mongoose.model('CampaignMold'),
  async = require('async');

var arrayObjectIndexOf = function(myArray, searchTerm, property) {
  for(var i = 0, len = myArray.length; i < len; i++) {
      if (myArray[i][property].toString() === searchTerm.toString()) return i;
  }
  return -1;
};

exports.home = function (req, res){
  res.render('system/mold');
};

exports.moldList = function(req, res){
  CampaignMold.find(function(err,molds){
    if(err){
      console.log(err);
      return res.send(500,{'result':0,'msg':'查找失败!'+err});
    }
    else{
      return res.send({'result':1,'molds':molds})
    }
  });
};

exports.addMold = function(req, res){
  var mold = new CampaignMold({
    name:req.body.name
  });
  mold.save(function(err){
    if(err){
      console.log(err);
      return res.send(500,{'result':0,'msg':'保存失败!'+err});
    }
    else{
      return res.send({'result':1,'msg':'保存成功!'});
    }
  });
};

exports.activate = function(req, res){
  CampaignMold.update({'_id':req.body.id},{'$set':{'enable':req.body.value}},function(err,module){
    if(err||!module){
      console.log(err);
      return res.send({'result':0,'msg':'查找失败!'});
    }
    else{
      return res.send({'result':1,'msg':'成功'})
    }
  });
};

exports.editMold = function(req, res){
  CampaignModule.find(function(err,modules){
    if(err){
      console.log(err);
      return res.send(500,{'result':0,'msg':'查找失败!'+err});
    }
    else{
      CampaignMold.findOne({'_id':req.params.moldId},function(err,mold){
        if(err){
          console.log(err);
          return res.send(500,{'result':0,'msg':'查找失败!'+err});
        }
        else{
          var temp ={
            '_id':mold._id,
            'name':mold.name,
            'modules':[]
          };
          if(mold.module){
            for(var i=0; i<mold.module.length; i++){
              var name = mold.module[i];
              var index = arrayObjectIndexOf(modules,name,'name');
              temp.modules.push({
                'name':name,
                'note':index>-1? modules[index].note : name,
                'value':true
              });
            }
          }
          for(var i=0; i<modules.length; i++){
            if(mold.module.length===0||mold.module.indexOf(modules[i].name)==-1){
              temp.modules.push({
                'name':modules[i].name,
                'note':modules[i].note,
                'value':false
              });
            }
          }
          return res.send(temp);
        }
      });
    }
  });
};

exports.saveMold = function(req, res){
  CampaignMold.findOne({'_id':req.body._id},function(err,mold){
    mold.name = req.body.name;
    mold.module=[];
    var modules = req.body.modules;
    for(var i=0;i<modules.length;i++){
      if(modules[i].value === true){
        mold.module.push(modules[i].name);
      }
    }
    mold.save(function(err){
      if(err){
        console.log(err);
        return res.send(500,{'result':0,'msg':'保存失败!'});
      }
      else{
        return res.send({'result':1,'msg':'保存成功'});
      }
    });
  });
};

exports.deleteMold = function(req, res){
  CampaignMold.remove({'_id':req.params.moldId},function(err){
    if(err){
      console.log(err);
      return res.send({'result':0,'msg':'删除失败!'});
    }
    else{
      return res.send({'result':1,'msg':'删除成功'})
    }
  });
};