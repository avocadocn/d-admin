'use strict';

var gulp = require('gulp');
var nodemon = require('gulp-nodemon');

gulp.task('nodemon', function () {
  nodemon({
    script: 'socketserver.js',
    ext: 'js',
    watch: [
      "**.js",
      "socketserver.js"
    ],
    ignore: [
      "node_modules/**"
    ],
    env: {
      "NODE_ENV": "development"
    },
  })
    .on('restart', function () {
      console.log('app restarted!')
    });

});

gulp.task('default', ['nodemon']);