module.exports = function(config) {
    config.set({
        basePath: './',

        frameworks: ['jasmine', 'browserify'],

        files: [
            { pattern: './node_modules/angular/angular.js',                   watched: false },
            { pattern: './node_modules/angular-sanitize/angular-sanitize.js', watched: false },
            { pattern: './node_modules/angular-messages/angular-messages.js', watched: false },
            { pattern: './node_modules/angular-mocks/angular-mocks.js',       watched: false },
            { pattern: './node_modules/ui-select/dist/select.js',             watched: false },
            { pattern: './app/**/tests/**/*.spec.js', watched: false }
        ],

        reporters: ['mocha'],

        preprocessors: {
            './app/**/tests/**/*.spec.js': ['browserify']
        },

        port: 7018,
        runnerPort: 7100,
        urlRoot: '/',

        logLevel: config.LOG_INFO,

        autoWatch: true,

        browsers: ['PhantomJS'],

        singleRun: false,

        browserify: {
            debug: true,
            transform: [['babelify', { sourceMapRelative: 'app' }]]
        }
    });
};
