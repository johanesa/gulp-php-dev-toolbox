'use strict';

var _ = require('lodash');
var gulp = require('gulp');
var phpunit = require('gulp-phpunit');
var minimist = require('minimist');
var del = require('del');
var gulpif = require('gulp-if');
var fileExists = require('file-exists');
var gutil = require('gulp-util');

var knownOptions = {
  string: ['testsuite', 'test', 'source'],
  boolean: ['coverage']
};

var commandLineOptions = minimist(process.argv.slice(2), knownOptions);

gulp.task('tests', 'Run the selected unit tests with phpunit. Requires a phpunit.xml.dist configuration file.', ['clear-coverage'], function () {
  var options;
  var projectRoot = gulp.task.configuration.projectRoot;

  options = {
    notify: false
  };

  gutil.log(gutil.colors.blue('Running task \'tests\' in directoy: ' + projectRoot));

  if (commandLineOptions.testsuite) {
    options.testSuite = commandLineOptions.testsuite;
    gutil.log(gutil.colors.blue('Run tests in test suite ' + commandLineOptions.testsuite));
  }

  if (commandLineOptions.coverage) {
    options.coverageHtml = 'coverage/';
  }

  if (commandLineOptions.test) {
    options.testClass = commandLineOptions.test;
    gutil.log(gutil.colors.blue('Run test file ' + commandLineOptions.test));
  }

  if (!fileExists(projectRoot + '/phpunit.xml.dist')) {
    gutil.log(gutil.colors.red('Mandatory file \'phpunit.xml.dist\' does not exists.'));

    return;
  }

  return gulp.src(projectRoot + '/phpunit.xml.dist')
    .pipe(gulpif(options.coverageHtml, gulp.dest('coverage/')))
    .pipe(phpunit(projectRoot + '/vendor/bin/phpunit', options));
}, {
  options: {
    'test': 'Run a single test. Example gulp tests --test [testname]',
    'testsuite': 'The test suite to run. Example gulp tests --testsuite [suiteName]',
    'coverage': 'Run the tests with coverage enabled. Coverage will be stored in a HTML report in coverage/coverage-html. ' +
      'Example gulp tests --coverage'
  }
});

gulp.task('clear-coverage', 'Clear the coverage reports files.', function () {
  var projectRoot = gulp.task.configuration.projectRoot;

  return del([projectRoot + '/coverage/**'], {
    force: true
  });
});

gulp.task('watch-tests', 'Watch for file changes and execute the tests task. Default the tests directory will be watched.', function () {
  var projectRoot = gulp.task.configuration.projectRoot;
  var source = 'tests/';

  if (!(commandLineOptions.test || commandLineOptions.testsuite)) {
    gutil.log(gutil.colors.red('No arguments supplied. Supply --test or --testsuite.'));

    return;
  }

  if (commandLineOptions.source) {
    source = commandLineOptions.source;
  } else if (_.has(gulp.task.configuration, 'tasks.watch-tests.source')) {
    source = gulp.task.configuration.tasks['watch-tests'].source;
    gutil.log(gutil.colors.blue('Read source from the configuration file: ' + source));
  }

  source = projectRoot + _.trimStart(source, '/');

  gutil.log(gutil.colors.blue('Watch directory ' + source + ' for changes and run the tests on.'));
  gulp.watch(source, ['tests']);
}, {
  options: {
    'test': 'The test to run when a file is changed. Example gulp watch-tests --test [path/test.php]',
    'testsuite': 'The test suite to run when a file is changed. Example gulp watch-tests --testsuite [suiteName]',
    'source': 'The directory to watch for file changes. Default the tests directory will be watched. Example gulp watch-tests ' +
      '--source=UnitTests/**/*.php'
  }
});

gulp.task('default', ['tests']);
