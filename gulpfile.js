'use strict';

var gulp = require('gulp-help')(require('gulp'));
var requireDir = require('require-dir');

requireDir('./tasks');

var configuration = {};

try {
  configuration = require('./dev-toolbox.config.json');
}
catch (error) {
}

gulp.task.configuration = configuration;

if (!configuration.projectRoot) {
  configuration.projectRoot = './';
}

configuration.projectRoot = gulp.task.configuration.projectRoot.trim('/');

gulp.task('default', ['composer:install', 'tests', 'checkstyle']);
