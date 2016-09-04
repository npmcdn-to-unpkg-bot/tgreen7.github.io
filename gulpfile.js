// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var gutil = require('gulp-util');
var cleanCSS = require('gulp-clean-css');
var del = require('del');
var autoprefixer = require('gulp-autoprefixer');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var sourcemaps = require('gulp-sourcemaps');
var plumber = require('gulp-plumber');
var browserSync = require('browser-sync').create();

// Compile Our Sass
gulp.task('styles', function() {
    return gulp.src('src/scss/**/*.scss')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass(
            {
                outputStyle: 'expanded', 
                sourceComments: true,
            }
        ).on('error', sass.logError))
        .pipe(autoprefixer('last 5 versions'))
        .pipe(gulp.dest('dist/css'))
        // minify
        .pipe(rename({suffix: '.min'}))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream({match: '**/*.css'}))
        .on('end', function () {
            gutil.log(gutil.colors.green('Styles task complete!'));
        });
});

// minifies other css
gulp.task('cssmin', function() {
    return gulp.src('src/css/**/*.css')
        .pipe(plumber())
        .pipe(autoprefixer('last 2 version'))
        // minify
        .pipe(rename({suffix: '.min'}))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('dist/css'))
        .on('end', function () {
            gutil.log(gutil.colors.green('Cssmin task complete!'));
        });
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src([
            'src/js/plugins.js',
            'src/js/main.js',
        ])
        .pipe(plumber())
        // .pipe(sourcemaps.init())
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        // .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.stream({match: '**/*.js'}))
        .on('end', function () {
            gutil.log(gutil.colors.green('Scripts task complete!'));
        });
});

// Watches html and reloads
gulp.task('html', function() {
    return gulp.src([
            './**/*.html',
            '!./node_modules/**/*'
        ])
        .pipe(plumber())
        .pipe(browserSync.stream())
        .on('end', function () {
            gutil.log(gutil.colors.green('HTML task complete!'));
        });
});

// compress images
gulp.task('images', function() {
  return gulp.src('src/img/**/*')
    .pipe(plumber())
    .pipe(cache(
        imagemin({ 
            progressive: true, 
            interlaced: true, 
        })
    ))
    .pipe(gulp.dest('dist/img'))
    .on('end', function () {
        gutil.log(gutil.colors.green('Images task complete!'));
    });
});

// Watch Files For Changes
gulp.task('watch', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    // Watch .scss files
    gulp.watch('src/scss/**/*.scss', ['styles']);
    // Watch .js files
    gulp.watch('src/js/**/*.js', ['scripts']);

    gulp.watch('./**/*.html', ['html']);
});

// Clean
gulp.task('clean', function() {
  return del(['dist/css', 'dist/js', 'dist/img']);
});

// Default task
gulp.task('default', ['clean'], function() {
  gulp.start('cssmin', 'styles', 'scripts', 'images', 'watch');
});
