const   gulp            = require('gulp'),
        clean           = require('gulp-clean'),
        uglify          = require('gulp-uglify'),
        cleanCss        = require('gulp-clean-css'),
        ts              = require('gulp-typescript'),
        copy            = require('gulp-copy'),
        rename          = require('gulp-rename'),
        sourcemaps      = require('gulp-sourcemaps');
        sass            = require('gulp-sass'),
        browserSync     = require('browser-sync'),        
        reload          = browserSync.reload;

const paths = {
    srcTsConfig: './src/tsc/tsconfig.json',
    srcTsAllFiles: './src/tsc/**/*.ts',
    srcSassAllFiles: './src/scss/**/*.scss',
    srcSassMain: './src/scss/main.scss',    

    dist: './dist',
    buildJs: './build/js',
    buildCss: './build/css'
};

// Browser-sync task
gulp.task('browserSync', function() {
    browserSync({
        server: {
            baseDir: './'            
        }
    });
});

gulp.task('clearBuild', function() {
    return gulp.src([paths.buildCss, paths.buildJs])
        .pipe(clean());
});

gulp.task('ts', function() {
    const tsProject = ts.createProject(paths.srcTsConfig);
    const tsResult = gulp.src(paths.srcTsAllFiles)
        .pipe(sourcemaps.init())
        .pipe(tsProject());    

    return [
        tsResult.js        
        .pipe(gulp.dest(paths.buildJs))
        .pipe(gulp.dest(paths.dist))
        .pipe(uglify({ preserveComments: 'false' })) 
        .pipe(rename({ suffix: '.min'}))
        .pipe(gulp.dest(paths.buildJs))
        .pipe(gulp.dest(paths.dist))
        .pipe(reload({ stream: true }))];
});

gulp.task('sass', function () {    
    return gulp.src(paths.srcSassMain)
        .pipe(sass())         
        .pipe(rename('jquery.brickyeditor.css'))
        .pipe(gulp.dest(paths.buildCss))
        .pipe(gulp.dest(paths.dist))
        .pipe(cleanCss())
        .pipe(rename({ suffix: '.min'}))
        .pipe(gulp.dest(paths.buildCss))
        .pipe(gulp.dest(paths.dist))
        .pipe(reload({ stream: true }));        
});

// changes tracking 
gulp.task('watcher',function(){
    gulp.watch(paths.srcTsAllFiles, ['ts']);
    gulp.watch(paths.srcSassAllFiles, ['sass']);
});

gulp.task('default', ['clearBuild', 'ts', 'sass', 'watcher', 'browserSync']);