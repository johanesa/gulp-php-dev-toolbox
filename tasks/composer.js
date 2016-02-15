'use strict';

var gulp = require('gulp');
var composer = require('gulp-composer');
var minimist = require('minimist');
var del = require('del');
var gutil = require('gulp-util');

var knownOptions = {
  boolean: ['force']
};

var commandLineOptions = minimist(process.argv.slice(2), knownOptions);

gulp.task('composer-install', 'Install all the required dependencies.', function () {
  if (commandLineOptions.force) {
    del(['vendor/', 'composer.lock']);
    gutil.log(gutil.colors.blue('Forced install triggerd, removing the vendor diretory and composer lock file.'));
  }

  return composer();
}, {
  options: {
    'force': 'Clears the vendor folder and composer lockfile before install the packages. For example gulp composer-install --force'
  }
});

gulp.task('composer-update-lockfile', 'Only update the composer lock file.', function () {
  return composer('update', { lock: true });
});

gulp.task('composer', ['composer-install']);

gulp.task('default', ['composer-install']);
