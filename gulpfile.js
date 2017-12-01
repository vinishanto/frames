var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");

gulp.task('dist', function() {
    // place code for your default task here
    gulp.src('jquery-frames.js')
        .pipe(gulp.dest('dist'))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist'));
});
