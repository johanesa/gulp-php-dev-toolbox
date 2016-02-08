var gulp = require('gulp-help')(require('gulp'));
var requireDir = require("require-dir");

var tasks = requireDir("./tasks");

var configuration = {};
try {
  configuration = require('./dev-toolbox.config.json');
}
catch(error) {
}

gulp.task.configuration = configuration;

gulp.task('default', ['composer:install', 'tests', 'checkstyle', 'checkstructure']);