var gulp  = require('gulp');
var composer = require('gulp-composer');
var minimist = require('minimist');
var del = require('del');
var gutil = require('gulp-util');

var knownOptions = {
  boolean: ['clean']
};

var commandLineOptions = minimist(process.argv.slice(2), knownOptions);

gulp.task('composer:install', 'Install all the required dependencies.', function () {
  if (commandLineOptions.clean) {
    del(['vendor/']);
    gutil.log(gutil.colors.blue('Clean install triggerd, the composer vendor directory will be removed.'));
  }

  return composer();
},{
  options: {
    'clean': 'Clears the vendor folder before install the packages. For example gulp composer:install --clear'
  }
});

gulp.task('composer:update-lockfile', 'Only update the composer lock file.', function () {
  return composer('update', {lock: true});
});

gulp.task('clear:vendor', 'Clear the composer vendor folder.', function() {
  return del(['vendor/']);
});

gulp.task('composer', ['composer:install']);

gulp.task('default', ['composer:install']);
