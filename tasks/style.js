'use strict';

var _ = require('lodash');
var gulp = require('gulp');
var phpcs = require('gulp-phpcs');
var phplint = require('phplint').lint;
var fileExists = require('file-exists');
var minimist = require('minimist');
var phpcbf = require('gulp-phpcbf');
var gutil = require('gulp-util');

var knownOptions = {
  string: ['source']
};

var commandLineOptions = minimist(process.argv.slice(2), knownOptions);

gulp.task('style-fix', 'Auto fix the php code styling using php code beautifier. Requires a phpcs.xml configuration file.', function () {
  if (!fileExists('phpcs.xml')) {
    gutil.log(gutil.colors.red('Mandatory file \'phpcs.xml\' does not exists.'));

    return;
  }

  return gulp.src('phpcs.xml')
    .pipe(phpcbf({
      bin: 'vendor/bin/phpcbf',
      standard: 'phpcs.xml'
    }))
    .on('error', gutil.log);
});

gulp.task('style-codestyle', 'Check the code style using php code sniffer. Requires a phpcs.xml configuration file.', function () {
  if (!fileExists('phpcs.xml')) {
    gutil.log(gutil.colors.red('Mandatory file \'phpcs.xml\' does not exists.'));

    return;
  }

  return gulp.src('phpcs.xml')
    .pipe(phpcs({
      bin: 'vendor/bin/phpcs',
      standard: 'phpcs.xml',
      colors: true
    }))
    .pipe(phpcs.reporter('log'));
});

gulp.task('style-syntax', 'Check the php syntax using php lint. Default scr/, tests and spec/ directories are checked.', function () {
  var source;

  source = ['scr/**/*.php', 'tests/**/*.php', 'spec/**/*.php'];

  if (commandLineOptions.source) {
    source = _.split(commandLineOptions.source, ',');
  } else if (_.has(gulp.task.configuration, 'tasks.style-syntax.source')) {
    source = gulp.task.configuration.tasks['style-syntax'].source;
    gutil.log(gutil.colors.blue('Read source from the configuration file: ' + source));
  }

  return phplint(source, { limit: 10 }, function (error) {
    if (error) {
      gutil.log(gutil.colors.red(error.message));
    } else {
      gutil.log(gutil.colors.green('No php syntax errors found.'));
    }
  });
}, {
  options: {
    'source': 'The source files to check the php code syntax. To add multiple sources use a \',\'.Example gulp style-syntax ' +
      '--source=Library/**/*.php,UnitTests/**/*.php'
  }
});

gulp.task('checkstyle', 'Check to code on styling and syntax.', ['style-codestyle', 'style-syntax']);

gulp.task('default', ['checkstyle']);
