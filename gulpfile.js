'use strict'; // eslint-disable-line

var path = require('path');

var _ = require('lodash');

var gulp        = require('gulp');
var runSequence = require('run-sequence');
var source      = require('vinyl-source-stream');
var buffer      = require('vinyl-buffer');
var del         = require('del');
var $           = require('gulp-load-plugins')();

var browserify = require('browserify');
var watchify   = require('watchify');
var envify     = require('envify/custom');

var NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV.toLowerCase() : 'development';
var PROD     = NODE_ENV === 'production';



// --- DEST ---
var DEST = {
    html:  path.join('dist'),
    html_templates:  path.join('dist', 'assets', 'templates'),
    js:    path.join('dist', 'assets', 'js'),
    css:   path.join('dist', 'assets', 'css'),
    fonts: path.join('dist', 'assets', 'fonts'),
    img:   path.join('dist', 'assets', 'img')
};



// --- HTML ---
function taskHtml() {
    return gulp.src('./app/index.html')
        .pipe($.if(PROD, $.htmlmin({ collapseWhitespace: true })))
        .pipe(gulp.dest(DEST.html))
        .pipe($.size());
}

function taskTemplatesHtml() {
    return gulp.src('app/templates/*.html')
        .pipe($.if(PROD, $.htmlmin({ collapseWhitespace: true })))
        .pipe(gulp.dest(DEST.html_templates))
        .pipe($.size());
}

// --- JS ---
var envifyValues = {
    NODE_ENV: NODE_ENV
};

var opts = _.assign({}, watchify.args, {
    entries: './app.js',
    debug: true,
    basedir: './app/'
});


var jsBundle = watchify(browserify(opts))
    .transform('babelify')
    .transform(envify(envifyValues))
    .transform('browserify-ngannotate');

if (PROD) {
    jsBundle = jsBundle.transform({ global: true }, 'uglifyify');
}

jsBundle.on('log', $.util.log.bind($.util, '[Browserify] Update app'));

jsBundle.on('update', taskJs);


function taskJs() {
    return jsBundle.bundle()
        .on('error', $.util.log.bind($.util, '[Browserify] Error'))
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe($.sourcemaps.init({ loadMaps: true }))
        .pipe($.if(PROD, $.uglify()))
        .pipe($.sourcemaps.write('./'))
        .pipe(gulp.dest(DEST.js))
        .pipe($.size());
}

function closeJsWatcher() {
    jsBundle.close();
}

// --- JS VENDORS ---
function taskVendorsJs() {
    var src = [
        './node_modules/angular/angular.js',
        './node_modules/angular-sanitize/angular-sanitize.js',
        './node_modules/angular-messages/angular-messages.js',
        './node_modules/ui-select/dist/select.js'
    ];

    return gulp.src(src)
        .pipe($.concat('vendors.js'))
        .pipe(gulp.dest(DEST.js));
}



// --- CSS ---
function taskCss() {
    var gulpRubySassOptions = {
        style: PROD ? 'compressed' : 'expanded',
        sourcemap: true
    };

    return $.rubySass('./app/app.scss', gulpRubySassOptions)
        .on('error', function (err) {
            $.util.log('[Sass] Error', err.message);
        })
        .pipe($.autoprefixer())
        .pipe(gulp.dest(DEST.css))
        .pipe($.size());
}

// --- CSS VENDORS ---
function taskVendorsCss() {
    var src = [
        './node_modules/bootstrap/dist/css/bootstrap.css',
        './node_modules/ui-select/dist/select.css',
        './node_modules/angular-material/angular-material.css',
        './node_modules/angular-material/angular-material.layouts.css'
    ];

    return gulp.src(src)
        .pipe($.concat('vendors.css'))
        .pipe(gulp.dest(DEST.css));
}



// --- CSS FONTS ---
function taskFontsCss() {
    var src = [
        './node_modules/bootstrap/dist/fonts/*'
    ];

    return gulp.src(src)
        .pipe(gulp.dest(DEST.fonts));
}



// --- TEMPLATES ---
function taskTemplates() {
    return gulp.src(['./app/**/*.html', '!./app/index.html'])
        .pipe($.if(PROD, $.htmlmin({ collapseWhitespace: true })))
        .pipe($.ngTemplate({ standalone: true }))
        .pipe($.if(PROD, $.uglify()))
        .pipe(gulp.dest(DEST.js))
        .pipe($.size());
}



// --- IMAGES ---
function taskImages() {
    return gulp.src('./app/img/**/*.{png,jpeg,jpg,svg}')
        .pipe($.newer(DEST.img))
        .pipe($.imagemin())
        .pipe(gulp.dest(DEST.img))
        .pipe($.size());
}



// --- SERVER ---
function taskServer() {
    return gulp.src(DEST.html)
        .pipe($.webserver({
            host: '0.0.0.0',
            livereload: true
        }));
}



// --- TASKS ---
gulp.task('clean', function clean() {
    return del([path.join(DEST.html, '**'), '!' + DEST.html], { force: true });
});

gulp.task('html', ['htmlMain', 'htmlTemplates']);
gulp.task('htmlMain', taskHtml);
gulp.task('htmlTemplates', taskTemplatesHtml);
gulp.task('js', ['js:app', 'js:vendors']);
gulp.task('js:app', taskJs);
gulp.task('js:vendors', taskVendorsJs);
gulp.task('css', ['css:app', 'css:vendors', 'css:fonts']);
gulp.task('css:app', taskCss);
gulp.task('css:vendors', taskVendorsCss);
gulp.task('css:fonts', taskFontsCss);
gulp.task('templates', taskTemplates);
gulp.task('images', taskImages);
gulp.task('server', taskServer);

gulp.task('_build', function(done) {
    runSequence(
        'clean',
        ['html', 'js', 'css', 'templates', 'images'],
        done
    );
});

gulp.task('build', ['_build'], function() {
    closeJsWatcher();
});

gulp.task('watch', ['_build'], function() {
    gulp.watch('./app/index.html', ['html']);

    gulp.watch('./app/templates/*.html', ['html']);

    // watch for js files is managed by watchify
    gulp.watch('./app/**/*.scss', ['css']);

    gulp.watch('./app/**/*.{png,jpeg,jpg,svg}', ['images']);

    gulp.watch(['./app/**/*.html', '!./app/index.html'], ['templates']);
});

gulp.task('default', function(done) {
    runSequence('watch', 'server', done);
});
