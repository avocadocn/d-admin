'use strict';

var mongoose = require('mongoose'),
  CampaignModule = mongoose.model('CampaignModule'),
  CampaignMold = mongoose.model('CampaignMold'),
  async = require('async');

exports.home = function (req, res){
  res.render('system/mold');
};

exports.moldList = function(req, res){
  CampaignModule.find(function(err,modules){
    if(err){
      console.log(err);
      return res.send(500,{'result':0,'msg':'查找失败!'+err});
    }
    CampaignMold.find(function(err,molds){
      if(err){
        console.log(err);
        return res.send(500,{'result':0,'msg':'查找失败!'+err});
      }
      async.parallel([
        function(allcallback){
          async.map(modules,function(module, callback){
            module.set('value',true,{strict:false});
            for(var i =0;i<molds.length;i++){
              if(!molds[i].modules||molds[i].modules.indexOf(module.name)===-1){
                module.set('value',false,{strict:false});
              }
            }
            callback(null,module);
          },function(err,results){
            if(err){
              return res.send({'result':0,'msg':'map1失败'+err});
            }
            else{
              allcallback(null,results)
            }
          });
        },
        function(allcallback){
          async.map(molds, function(mold, callback){
            var newmold = {
              name:mold.name,
              _id:mold._id,
              enable:mold.enable,
              module:mold.module,
              components:[]
            }
            for(var i=0;i<modules.length;i++){
              newmold.components[i]={
                value:mold.module.indexOf(modules[i])>-1? 1:0,
                name:modules[i].name,
                note:modules[i].note
              };
            }
            // console.log('mold',newmold);
            callback(null,newmold);
          },function(err,results){
            if(err){
              return res.send({'result':0,'msg':'map2失败'+err});
            }
            else{
              // console.log(results);
              // console.log(results[0].components);
              // console.log(results[0].components[0]);
              allcallback(null,results);
              // console.log('done');
              // var newMolds = results;
              // return res.send({'molds':newMolds,'modules':newModules});
            }
          });          
        }
      ],function(err,results){
        // console.log(results);
        return res.send({'components':results[0],'molds':results[1]});
      });
    });
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

exports.saveMolds = function(req, res){

};

exports.delete = function(req, res){
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