'use strict';

var mongoose = require('mongoose'),
  Question = mongoose.model('Question');

exports.createQuestion = function (req, res) {
  var question = new Question({
    group_type: req.body.group_type,
    content: req.body.content,
    answer: req.body.answer
  });
  question.save(function (err) {
    if (err) {
      console.log(err.stack || err);
      res.send(500, {msg: '服务器错误，创建失败'});
    }
    else {
      res.send(201, {msg: '创建成功'});
    }
  });
};

exports.editQuestion = function (req, res) {
  Question.findById(req.params.questionId)
    .exec()
    .then(function (question) {
      if (!question) {
        res.send(404, {msg: '404'});
      }
      else {
        if (req.body.group_type) {
          question.group_type = req.body.group_type;
        }
        if (req.body.content) {
          question.content = req.body.content;
        }
        if (req.body.answer) {
          question.answer = req.body.answer;
        }
        if (req.body.status) {
          question.status = req.body.status;
        }
        question.save(function (err) {
          if (err) {
            console.log(err.stack || err);
            res.send(500, {msg: '服务器错误，修改失败'});
          }
          else {
            res.send({msg: '修改成功'});
          }
        });
      }
    })
    .then(null, function (err) {
      console.log(err.stack || err);
      res.send(500, {msg: '服务器错误，修改失败'});
    });
};

exports.getQuestionList = function (req, res) {
  Question.find({})
    .limit(100)
    .exec()
    .then(function (questions) {
      res.send({questions: questions});
    })
    .then(null, function (err) {
      console.log(err.stack || err);
      res.send(500, {msg: '服务器错误，获取列表失败'});
    });
};

exports.renderMangerTemplateView = function (req, res) {
  res.render('system/question');
};



