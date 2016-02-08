var gulp  = require('gulp');
var phpunit = require('gulp-phpunit');
var minimist = require('minimist');
var del = require('del');
var gulpif = require('gulp-if');
var fileExists = require('file-exists');
var gutil = require('gulp-util');

var knownOptions = {
  string: ['testsuite', 'test'],
  boolean: ['coverage'],
  alias: ['s', 'c', 't']
};

var commandLineOptions = minimist(process.argv.slice(2), knownOptions);

gulp.task('tests', 'Run the selected unit tests with phpunit. Requires a phpunit.xml.dist configuration file.', ['clear:coverage', 'composer:install'], function() {
  var options;

  options = {};

  if (commandLineOptions.testsuite || commandLineOptions.s) {
    options.testSuite = commandLineOptions.testsuite || commandLineOptions.s;
  }

  if(commandLineOptions.coverage || commandLineOptions.c) {
    options.coverageHtml = 'coverage/';
  }

  if(commandLineOptions.test || commandLineOptions.t) {
    options.filter = commandLineOptions.test || commandLineOptions.t;
  }

  if(!fileExists('phpunit.xml.dist')) {
    gutil.log(gutil.colors.red('Mandatory file \'phpunit.xml.dist\' does not exists.'));
    return;
  }

  return gulp.src('phpunit.xml.dist')
    .pipe(gulpif(options.coverageHtml, gulp.dest('coverage/')))
    .pipe(phpunit('./vendor/bin/phpunit', options));
},{
  options: {
    'test | t': 'Run a single test. Example gulp tests --test [testname]',
    'testsuite | s': 'The test suite to run. Example gulp tests --testsuite [suiteName]',
    'coverage | c ': 'Run the tests with coverage enabled. Coverage will be stored in a HTML report in coverage/coverage-html. Example gulp tests --coverage'
  }
});

gulp.task('clear:coverage', 'Clear the coverage reports files.', function() {
  return del(['coverage/**']);
});

gulp.task('default', ['tests']);