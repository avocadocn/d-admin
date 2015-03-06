'use strict';

var mongoose = require('mongoose'),
  Term = mongoose.model('Term');

exports.createTerm = function (req, res) {
  var term = new Term({
    start_time: req.body.start_time,
    end_time: req.body.end_time,
    content: req.body.content
  });
  term.save(function (err) {
    if (err) {
      res.send({msg: '创建成功'});
    }
    else {
      console.log(err.stack);
      res.send(500, {msg: '服务器错误，创建失败'});
    }
  });
};

exports.editTerm = function (req, res) {
  Term.findById(req.params.termId).exec()
    .then(function (term) {
      if (!term) {
        res.send(404, {msg: '404'});
      }
      else {
        if (req.body.start_time) {
          term.start_time = req.body.start_time;
        }
        if (req.body.end_time) {
          term.end_time = req.body.end_time;
        }
        if (req.body.content) {
          term.content = req.body.content;
        }
        if (req.body.status) {
          term.status = req.body.status;
        }

        saveTerm(term);
      }
    })
    .then(null, function (err) {
      console.log(err.stack);
      res.send(500, {msg: '服务器错误，修改失败。'});
    });

  function saveTerm(term) {
    term.save(function (err) {
      if (err) {
        console.log(err.stack);
        res.send(500, {msg: '服务器错误，修改失败。'});
      }
      else {
        res.send({msg: '修改成功'});
      }
    });
  }
};