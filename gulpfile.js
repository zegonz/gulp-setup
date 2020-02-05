var gulp = require('gulp');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var extender = require('gulp-html-extend');
var imagemin = require('gulp-imagemin');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var cleanCSS = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');

var dist = "./dist"

gulp.task('serve', ['sass', 'js', 'extend', 'img'], function() {
    browserSync.init({
        server: dist
    });
    gulp.watch("src/sass/**/*.scss", ['sass']);
    gulp.watch("src/js/*.js", ['js']);
    gulp.watch("src/**/*.html", ['extend']);
    gulp.watch("dist/*.html").on('change', browserSync.reload);
    gulp.watch("src/img/**", ['img']);
});

// Compile sass + autoprefix into CSS with a source & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("src/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
        browsers: ['last 2 versions']
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(dist + "/css"))
    .pipe(browserSync.stream());
});

//Concatenation js + source map
gulp.task('js', function(){
    return gulp.src('src/js/script.js')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(concat('script.js'))
    .pipe(gulp.dest(dist + '/js'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(dist + '/js'))
    .pipe(browserSync.stream());
});

//Extend/includes HTML (et plus...)
gulp.task('extend', function () {
    gulp.src('./src/*.html')
    .pipe(plumber())
    .pipe(extender({annotations:false,verbose:true})) // default options
    .pipe(gulp.dest(dist))
});

//Minification img
gulp.task('img', function () {
    gulp.src('src/img/*')
    .pipe(plumber())
    .pipe(imagemin())
    .pipe(gulp.dest(dist + '/img'))
});

//Tache de minification JS
gulp.task('uglify', function(){
    return gulp.src('dist/js/script.js')
    .pipe(uglify())
    .pipe(gulp.dest(dist + '/js'))
});

//Tache de minification Css
gulp.task('min-css', function() {
    return gulp.src('dist/css/style.css')
    .pipe(cleanCSS())
    .pipe(gulp.dest(dist + '/css'));
});

//Tache pour initialiser
gulp.task('init', ['create']);

//Tache par défaut avec lancement de Browsersync
gulp.task('default', ['serve']);