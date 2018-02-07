import * as browserify from 'browserify';
import * as del from 'del';
import * as gulp from 'gulp';
import * as loadPlugins from 'gulp-load-plugins';
import * as path from 'path';
import * as runSequence from 'run-sequence';
import * as tsify from 'tsify';
import * as buffer from 'vinyl-buffer';
import * as source from 'vinyl-source-stream';
import * as watchify from 'watchify';

const envify = require('envify/custom');
const $: any = loadPlugins();
const NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV.toLowerCase() : 'development';
const PROD = NODE_ENV === 'production';

// --- DEST ---
const DEST = {
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
const envifyValues = { NODE_ENV };

const opts = {
    ...watchify.args,
    entries: './app.ts',
    debug: true,
    basedir: './app/'
};

let jsBundle: any = watchify(browserify(opts).plugin('tsify', { project: './tsconfig.json', files: [] }))
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
    const src = [
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
    const gulpRubySassOptions = {
        style: PROD ? 'compressed' : 'expanded',
        sourcemap: true
    };

    return $.rubySass('./app/app.scss', gulpRubySassOptions)
        .on('error', err => $.util.log('[Sass] Error', err.message))
        .pipe($.autoprefixer())
        .pipe(gulp.dest(DEST.css))
        .pipe($.size());
}

// --- CSS VENDORS ---
function taskVendorsCss() {
    const src = [
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
    const src = [
        './node_modules/bootstrap/dist/fonts/*',
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
gulp.task('clean', () => del([path.join(DEST.html, '**'), '!' + DEST.html], { force: true }));
gulp.task('htmlMain', taskHtml);
gulp.task('htmlTemplates', taskTemplatesHtml);
gulp.task('html', ['htmlMain', 'htmlTemplates']);
gulp.task('js:app', taskJs);
gulp.task('js:vendors', taskVendorsJs);
gulp.task('js', ['js:app', 'js:vendors']);
gulp.task('css:app', taskCss);
gulp.task('css:vendors', taskVendorsCss);
gulp.task('css:fonts', taskFontsCss);
gulp.task('css', ['css:app', 'css:vendors', 'css:fonts']);
gulp.task('templates', taskTemplates);
gulp.task('images', taskImages);
gulp.task('server', taskServer);

gulp.task('_build', done => runSequence(
    'clean',
    ['html', 'js', 'css', 'templates', 'images'],
    done
));

gulp.task('build', ['_build'], () => closeJsWatcher());

gulp.task('watch', ['_build'], () => {
    gulp.watch('./app/index.html', ['html']);

    gulp.watch('./app/templates/*.html', ['html']);

    // watch for js files is managed by watchify
    gulp.watch('./app/**/*.scss', ['css']);

    gulp.watch('./app/**/*.{png,jpeg,jpg,svg}', ['images']);

    gulp.watch(['./app/**/*.html', '!./app/index.html'], ['templates']);
});

gulp.task('default', done => runSequence('watch', 'server', done));
