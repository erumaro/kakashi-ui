const { src, dest, watch, series, parallel } = require("gulp");
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const replace = require('gulp-replace');

const files = {
    sassPath: 'src/sass/**/*.scss'
}

function sassTask() {
    return src(files.sassPath)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(postcss([ autoprefixer(), cssnano() ]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('dist'))
};

function cacheBustTask() {
    var cbString = new Date().getTime();
    return src(['index.html'])
        .pipe(replace(/cb=\d+/, 'cb=' + cbString))
        .pipe(dest('.'));
}

function watchTask() {
    watch(
        [files.sassPath],
        series(
            parallel(sassTask),
            cacheBustTask
        )
    );
}

exports.default = series(
    parallel(sassTask),
    cacheBustTask,
    watchTask
);