var gulp   = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('default', function () {
  gulp.src('./hash-sync.js')
    .pipe(uglify())
    .pipe(rename('hash-sync.min.js'))
    .pipe(gulp.dest('.'));
});