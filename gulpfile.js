/* jshint node: true */

'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var path = require('path');

var resources = {
  sourceRoot: path.join(__dirname, 'es6'),
  es6: './es6/**/*.js',
  es5: './es5'
};

var config = {};

gulp.task('js', function() {
  return gulp.src(resources.es6)
    .pipe($.sourcemaps.init())
    .pipe($.babel())
    .pipe($.sourcemaps.write('.', { sourceRoot: resources.sourceRoot }))
    .pipe(gulp.dest(resources.es5));
});

gulp.task('watch', function() {
  gulp.watch(resources.es6, [ 'js' ]);
});

gulp.task('default', [ 'js', 'watch' ]);
