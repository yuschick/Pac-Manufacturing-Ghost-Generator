'use strict';

var gulp = require('gulp');
var util = require('gulp-util');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cache = require('gulp-cached');

var config = {
    srcSass: './src/styles/**/*.scss',
    srcJs: './src/js/*.js',
    vendorJs: './src/js/vendor/*.js',
    production: !!util.env.production
};

gulp.task('sass', function() {
    return gulp.src(config.srcSass)
        .pipe(sass(config.production ? {
            outputStyle: 'compressed'
        } : {}).on('error', sass.logError))
        .pipe(config.production ? concat('main.min.css') : util.noop())
        .pipe(gulp.dest('./lib/styles/'));
});

gulp.task('js', function() {
    gulp.src(config.srcJs)
        .pipe(cache('js-processing'))
        .pipe(babel({
            presets: ['es2016']
        }))
        .pipe(config.production ? concat('app.min.js') : util.noop())
        .pipe(config.production ? uglify() : util.noop())
        .pipe(gulp.dest('./lib/js'));

    gulp.src(['./src/js/vendor/handlebars-v4.0.5.js'])
        .pipe(cache('vendor-processing'))
        .pipe(uglify())
        .pipe(concat('vendor.min.js'))
        .pipe(gulp.dest('./lib/js/vendor'));
});


gulp.task('watch', function() {
    gulp.watch(config.srcSass, ['sass']);
    gulp.watch(config.srcJs, ['js']);
});

gulp.task('default', ['sass', 'js', 'watch']);
