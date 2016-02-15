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
  var projectRoot = gulp.task.configuration.projectRoot;

  if (!fileExists(projectRoot + '/phpcs.xml')) {
    gutil.log(gutil.colors.red('Mandatory file \'phpcs.xml\' does not exists.'));

    return;
  }

  return gulp.src(projectRoot + '/phpcs.xml')
    .pipe(phpcbf({
      bin: projectRoot + '/vendor/bin/phpcbf',
      standard: projectRoot + '/phpcs.xml'
    }))
    .on('error', gutil.log);
});

gulp.task('codestyle', 'Check the code style using php code sniffer. Requires a phpcs.xml configuration file.', function () {
  var projectRoot = gulp.task.configuration.projectRoot;

  if (!fileExists(projectRoot + '/phpcs.xml')) {
    gutil.log(gutil.colors.red('Mandatory file \'phpcs.xml\' does not exists.'));

    return;
  }

  return gulp.src(projectRoot + '/phpcs.xml')
    .pipe(phpcs({
      bin: projectRoot + '/vendor/bin/phpcs',
      standard: projectRoot + '/phpcs.xml',
      colors: true
    }))
    .pipe(phpcs.reporter('log'));
});

gulp.task('syntax', 'Check the php syntax using php lint. Default scr/ and tests/ directories are checked.', function () {
  var projectRoot = gulp.task.configuration.projectRoot;
  var sources;

  sources = ['scr/**/*.php', 'tests/**/*.php'];

  if (commandLineOptions.source) {
    sources = _.split(commandLineOptions.source, ',');
  } else if (_.has(gulp.task.configuration, 'tasks.style-syntax.source')) {
    sources = gulp.task.configuration.tasks['style-syntax'].source;
    gutil.log(gutil.colors.blue('Read source from the configuration file: ' + sources));
  }

  sources = _.map(sources, function (sourceValue) {
    return projectRoot + _.trimStart(sourceValue, '/');
  });

  return phplint(sources, { limit: 10 }, function (error) {
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

gulp.task('watch-syntax', 'Watch for file changes and execute the syntax task. Default scr/ and tests/ directories will be watched.', function () {
  var projectRoot = gulp.task.configuration.projectRoot;
  var sources = ['scr/**/*.php', 'tests/**/*.php'];

  if (commandLineOptions.source) {
    sources = _.split(commandLineOptions.source, ',');
  } else if (_.has(gulp.task.configuration, 'tasks.watch-syntax.source')) {
    sources = gulp.task.configuration.tasks['watch-syntax'].source;
    gutil.log(gutil.colors.blue('Read source from the configuration file: ' + sources));
  }

  sources = _.map(sources, function (sourceValue) {
    return projectRoot + _.trimStart(sourceValue, '/');
  });

  gutil.log(gutil.colors.blue('Watch directory ' + sources + ' for changes and run the syntax checks on.'));
  gulp.watch(sources, ['style-syntax']);
}, {
  options: {
    'source': 'The directory to watch for file changes. To add multiple sources use a \',\'.Example gulp watch-syntax ' +
      '--source=Library/**/*.php,UnitTests/**/*.php'
  }
});

gulp.task('watch-codestyle', 'Watch for file changes and execute the codestyle task. Default scr/ and tests/ will be watched.', function () {
  var projectRoot = gulp.task.configuration.projectRoot;
  var sources = ['scr/**/*.php', 'tests/**/*.php'];

  if (commandLineOptions.source) {
    sources = _.split(commandLineOptions.source, ',');
  } else if (_.has(gulp.task.configuration, 'tasks.watch-codestyle.source')) {
    sources = gulp.task.configuration.tasks['watch-codestyle'].source;
    gutil.log(gutil.colors.blue('Read source from the configuration file: ' + sources));
  }

  sources = _.map(sources, function (sourceValue) {
    return projectRoot + _.trimStart(sourceValue, '/');
  });

  gutil.log(gutil.colors.blue('Watch directory ' + sources + ' for changes and run the codestyle checks on.'));
  gulp.watch(sources, ['style-codestyle']);
}, {
  options: {
    'source': 'The directory to watch for file changes. To add multiple sources use a \',\'.Example gulp watch-codestyle ' +
      '--source=Library/**/*.php,UnitTests/**/*.php'
  }
});

gulp.task('checkstyle', 'Check to code on styling and syntax.', ['codestyle', 'syntax']);

gulp.task('default', ['checkstyle']);
