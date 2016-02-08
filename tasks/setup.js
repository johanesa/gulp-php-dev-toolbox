var gulp  = require('gulp');
var minimist = require('minimist');
var del = require('del');
var gutil = require('gulp-util');
var fileExists = require('file-exists');
var shell = require('gulp-shell');

var knownOptions = {
  boolean: ['force'],
  string: ['destination']
};

var commandLineOptions = minimist(process.argv.slice(2), knownOptions);

gulp.task('copy:gulpfiles', false, function () {
  if(!commandLineOptions.destination) {
    gutil.log(gutil.colors.red('Can \'t setup php dev tools, missing destination directory.'));
    return;
  }

  if (commandLineOptions.force) {
    del([commandLineOptions.destination]);
    gutil.log(gutil.colors.blue('Clean install triggerd, the ' + commandLineOptions.destination + ' directory will be removed.'));
  }

   return gulp.src(['gulpfile.js', 'package.json'])
    .pipe(gulp.dest(commandLineOptions.destination))
});

gulp.task('copy:tasks', false, ['copy:gulpfiles'], function () {
  if(!commandLineOptions.destination) {
    gutil.log(gutil.colors.red('Can \'t setup php dev tools, missing destination directory.'));
    return;
  }

   return gulp.src(['tasks/**/*.js'])
    .pipe(gulp.dest(commandLineOptions.destination + '/tasks/'))
});

gulp.task('npm:install', false, ['copy:gulpfiles', 'copy:tasks'], function () {
  if(!commandLineOptions.destination) {
    gutil.log(gutil.colors.red('Can \'t setup php dev tools, missing destination directory.'));
    return;
  }

  return gulp.src('', {read: false})
    .pipe(shell(['cd ' + commandLineOptions.destination + ' && npm install']));
});

gulp.task('setup', 'Setup the gulp php dev tools into your project', ['copy:gulpfiles', 'copy:tasks', 'npm:install']);
