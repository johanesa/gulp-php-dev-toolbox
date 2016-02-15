'use strict';

var _ = require('lodash');
var gulp = require('gulp');
var phpcpd = require('gulp-phpcpd');
var shell = require('gulp-shell');
var minimist = require('minimist');
var gutil = require('gulp-util');

var knownOptions = {
  string: ['source']
};

var commandLineOptions = minimist(process.argv.slice(2), knownOptions);

gulp.task('structure-duplication', 'Detection for duplicate code. Default scr/ directory is checked.', function () {
  var projectRoot = gulp.task.configuration.projectRoot;
  var sources = ['scr/**/*.php'];

  if (commandLineOptions.source) {
    sources = _.split(commandLineOptions.source, ',');
  } else if (_.has(gulp.task.configuration, 'tasks.structure-duplication.source')) {
    sources = gulp.task.configuration.tasks['structure-duplication'].source;
    gutil.log(gutil.colors.blue('Read source from the configuration file: ' + sources));
  }

  sources = _.map(sources, function (sourceValue) {
    return projectRoot + _.trimStart(sourceValue, '/');
  });

  return gulp.src(sources)
    .pipe(phpcpd({
      minLines: 5,
      bin: projectRoot + '/vendor/bin/phpcpd'
    }));
}, {
  options: {
    source: 'The source files to check the php code duplication. To add multiple sources use a \',\'. Example gulp structure-duplication ' +
     '--source=Library/**/*.php,UnitTests/**/*.php'
  }
});

gulp.task('structure-complexity', 'Check the complexity of the code. Default scr/ directory is checked.', function () {
  var projectRoot = gulp.task.configuration.projectRoot;
  var sources = 'scr/';

  if (commandLineOptions.source) {
    sources = commandLineOptions.source;
  } else if (_.has(gulp.task.configuration, 'tasks.structure-complexity.source')) {
    sources = gulp.task.configuration.tasks['structure-complexity'].source;
    gutil.log(gutil.colors.blue('Read source from the configuration file: ' + sources));
  }

  sources = _.map(sources, function (sourceValue) {
    return projectRoot + _.trimStart(sourceValue, '/');
  });

  return gulp.src('', { read: false })
    .pipe(shell([
      ['vendor/bin/phpmd ' + sources + ' text codesize,unusedcode,naming,design,cleancode,controversial']
    ]));
}, {
  options: {
    source: 'The source files to check the php code complexity. To add multiple sources use a \',\'. Example gulp structure-complexity ' +
      '--source=Library/,UnitTests/'
  }
});

gulp.task('checkstructure', 'Check to code stucture on complexity and duplication.', ['structure-duplication', 'structure-complexity']);

gulp.task('default', ['checkstructure']);
