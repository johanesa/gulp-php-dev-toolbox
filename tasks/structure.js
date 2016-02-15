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
  var source = ['scr/**/*.php'];

  if (commandLineOptions.source) {
    source = _.split(commandLineOptions.source, ',');
  } else if (_.has(gulp.task.configuration, 'tasks.structure-duplication.source')) {
    source = gulp.task.configuration.tasks['structure-duplication'].source;
    gutil.log(gutil.colors.blue('Read source from the configuration file: ' + source));
  }

  return gulp.src(source)
    .pipe(phpcpd({
      minLines: 5,
      bin: 'vendor/bin/phpcpd'
    }));
}, {
  options: {
    source: 'The source files to check the php code duplication. To add multiple sources use a \',\'. Example gulp structure-duplication ' +
     '--source=Library/**/*.php,UnitTests/**/*.php'
  }
});

gulp.task('structure-complexity', 'Check the complexity of the code. Default scr/ directory is checked.', function () {
  var source = 'scr/';

  if (commandLineOptions.source) {
    source = commandLineOptions.source;
  } else if (_.has(gulp.task.configuration, 'tasks.structure-complexity.source')) {
    source = gulp.task.configuration.tasks['structure-complexity'].source;
    gutil.log(gutil.colors.blue('Read source from the configuration file: ' + source));
  }

  return gulp.src('', { read: false })
    .pipe(shell([
      ['vendor/bin/phpmd ' + source + ' text codesize,unusedcode,naming,design,cleancode,controversial']
    ]));
}, {
  options: {
    source: 'The source files to check the php code complexity. To add multiple sources use a \',\'. Example gulp structure-complexity ' +
      '--source=Library/,UnitTests/'
  }
});

gulp.task('checkstructure', 'Check to code stucture on complexity and duplication.', ['structure-duplication', 'structure-complexity']);

gulp.task('default', ['checkstructure']);
