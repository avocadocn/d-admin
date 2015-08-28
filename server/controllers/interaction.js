'use strict';

// mongoose models
var mongoose = require('mongoose'),
    Interaction= mongoose.model('Interaction'),
    ActivityTemplate= mongoose.model('ActivityTemplate'),
    PollTemplate= mongoose.model('PollTemplate'),
    QuestionTemplate= mongoose.model('QuestionTemplate');
var donlerValidator = require('../service/donler_validator.js'),
    multerService = require('../service/multerService.js'),
    tools = require('../service/tools.js');
var perPageNum = 10;
var interactionTypes = ['activity','poll','question'];
exports.templateFormFormat = function(req, res, next) {
  req.body.templateType = parseInt(req.body.templateType);
  if(req.body.location) {
    req.body.location = {
      "name": req.body.location
    }
    if(req.body.longitude){
      req.body.location.loc = {
        "coordinates" : [parseFloat(req.body.longitude),parseFloat(req.body.latitude)],
      }
    }
  }
  if(req.body.option) {
    req.body.option = req.body.option.split(",")
  }
  if(req.body.tags) {
    req.body.tags = tools.unique(req.body.tags.split(","));
  }
  next();
}
/**
 * 发互动的模板的验证
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.createTemplateValidate = function (req, res, next) {
  var locationValidator = function(name, value, callback) {
    if(!value) return callback(true);
    if(!value.name) return callback(false,"没有地址")
    if(value.loc && value.loc.coordinates && (!value.loc.coordinates instanceof Array || value.loc.coordinates.length !=2 || typeof value.loc.coordinates[0] !=="number" || typeof value.loc.coordinates[1] !=="number")) return callback(false,"坐标格式错误");
    return callback(true);
  };
  var templateType = req.body.templateType;
  donlerValidator({
    templateType: {
      name: '模板类型',
      value: templateType,
      validators: ['required',, donlerValidator.enum([1, 2, 3],"模板类型错误")]
    },
    theme: {
      name: '主题',
      value: req.body.theme,
      validators: ['required']
    },
    // content: {
    //   name: '内容',
    //   value: req.body.content,
    //   validators: ['required']
    // },
    endTime: {
      name: '结束时间',
      value: req.body.endTime,
      validators: [templateType=== 1 ?'required':undefined,'date',donlerValidator.after(req.body.startTime)]
    },
    startTime: {
      name: '开始时间',
      value: req.body.startTime,
      validators: templateType=== 1 ? ['required','date',donlerValidator.after(new Date())] : ['date']
    },
    memberMin:{
      name: '最小人数',
      value: req.body.memberMin,
      validators: ['number']
    },
    memberMax: {
      name: '最大人数',
      value: req.body.memberMax,
      validators: ['number']
    },
    location:{
      name: '地点',
      value: req.body.location,
      validators: templateType=== 1 ? ['required',locationValidator] : []
    },
    deadline: {
      name: '截止时间',
      value: req.body.deadline,
      validators: ['date',donlerValidator.before(req.body.endTime),donlerValidator.after(new Date())]
    },
    // activityMold: {
    //   name: '活动类型',
    //   value: req.body.activityMold,
    //   validators: templateType=== 1 ? ['required'] :[]
    // },
    option: {
      name: '选项',
      value: req.body.option,
      validators: templateType=== 2 ? ['required','array', donlerValidator.minLength(2)] :[]
    },
    tags: {
      name: '标签',
      value: req.body.tags,
      validators: ['array']
    },
  }, 'fast', function (pass, msg) {
    if (pass) {
      if(req.files) {
        multerService.formatPhotos(req.files, {getSize:true}, function(err, files) {
          var photos = [];
          if(files && files.length) {
            files.forEach(function(img) {
              var photo = {
                uri: multerService.getRelPath(img.path),
                width: img.size.width,
                height: img.size.height
              };
              photos.push(photo);
            });
            req.body.photos = photos;
          }
          next();
        });
      }
      else {
        next();
      }
    } else {
      var resMsg = donlerValidator.combineMsg(msg);
      return res.status(400).send({ msg: resMsg });
    }
  });
}
/**
 * 获取模板列表,分三种类型,按照创建时间分页
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.getTemplateList = function (req, res) {
  var option,templateModel;
  switch(req.query.templateType) {
    case '1':
      templateModel = "ActivityTemplate";
      break;
    case '2':
      templateModel = "PollTemplate";
      break;
    case '3':
      templateModel = "QuestionTemplate";
      break;
    default:
      return res.status(400).send({msg:"互动类型错误"});
  }
  if(req.query.createTime) {
    option.createTime ={"$lt":req.query.createTime}
  }
  var _perPageNum = req.query.limit || perPageNum;
  mongoose.model(templateModel).find(option)
  .sort({ createTime: -1 })
  .limit(_perPageNum)
  .exec()
  .then(function (templates) {
    return res.send(templates);
  })
  .then(null,function (error) {
    log(error);
    return res.status(500).send({msg:"服务器发生错误"});
  });
}
/**
 * 创建模板，三种类型
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.createTemplate = function (req, res) {
  var data = req.body;
  var template;
  switch(req.body.templateType) {
    case 1:
      template = new ActivityTemplate({
        theme: data.theme,
        content: data.content,
        location: data.location,
        startTime: data.startTime,
        endTime: data.endTime,
        activityMold: data.activityMold,
        memberMin: data.memberMin,
        memberMax: data.memberMax,
        deadline: data.deadline,
        tags:data.tags,
        photos: data.photos
      });
      break;
    case 2:
      template = new PollTemplate({
        theme: data.theme,
        content: data.content,
        endTime: data.endTime,
        tags:data.tags,
        photos: data.photos
      });
      var option =[];
      data.option.forEach(function(_option, index){
        option.push({
          index:index,
          value:_option
        })
      });
      template.option = option;
      break;
    case 3:
      template = new QuestionTemplate({
        theme: data.theme,
        content: data.content,
        endTime: data.endTime,
        tags:data.tags,
        photos: data.photos
      });
      break;
  }
  template.save(function (error) {
    if(error) {
      return res.status(500).send({msg:error});
    }
    else {
      return res.send(template);
    }
  })
}
/**
  * 获取模板详情，根据templateId
  * @param  {[type]} req [description]
  * @param  {[type]} res [description]
  * @return {[type]}     [description]
  */
exports.getTemplateDetail = function (req, res) {
  if (!mongoose.Types.ObjectId.isValid(req.params.templateId)) {
    return res.status(400).send({msg:"数据格式错误"});
  }
  var option,templateModel;
  switch(req.params.templateType) {
    case '1':
      templateModel = "ActivityTemplate";
      break;
    case '2':
      templateModel = "PollTemplate";
      break;
    case '3':
      templateModel = "QuestionTemplate";
      break;
    default:
      return res.status(400).send({msg:"互动类型错误"});
  }
  mongoose.model(templateModel).findById(req.params.templateId)
    .exec()
    .then(function (template) {
      return res.send(template);
    })
    .then(null,function (error) {
      log(error);
      return res.status(500).send({msg:"服务器发生错误"});
    });
}
exports.getInteractionList = function(req, res) {
  var option={},populateType;
  if(req.query.cid) {
    option.cid =req.query.cid
  }
  if(req.query.startTime) {
    option.startTime ={"$gte":req.query.startTime}
  }
  if(req.query.endTime) {
    option.endTime ={"$lt":req.query.endTime}
  }
  if(req.query.createTime) {
    option.createTime ={"$lt":req.query.createTime}
  }
  var _perPageNum = req.query.limit || perPageNum;
  switch(req.query.type) {
    //活动
    case '1':
      option.type =1;
      populateType = interactionTypes[0];
      break;
    //投票
    case '2':
      option.type =2;
      populateType = interactionTypes[1];
      break;
    //求助
    case '3':
      option.type =3;
      populateType = interactionTypes[2];
      break;
    default:
      populateType = 'activity poll question';
  }
  Interaction.find(option)
  .populate(populateType)
  .sort({ createTime: -1 })
  .limit(_perPageNum)
  .exec()
  .then(function (interactions) {
    res.send(interactions);
  })
  .then(null,function (error) {
    console.log(error);
    res.status(500).send({msg:"服务器错误"});
  });
}