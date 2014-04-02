module.exports = function (config) {
    "use strict";
    config.set({

        files: [
            'client/js/jquery.min.js',
            'client/js/bootstrap.min.js',
            'client/js/angular.min.js',
            'client/js/angular-mocks.js',
            'client/chat.js',
            'test/client/unit/*.js'
        ],

        exclude: [
            'server.js'
        ],

        autoWatch: true,

        frameworks: ['jasmine'],

        browsers: ['PhantomJS'],

        plugins: [
            'karma-phantomjs-launcher',
            'karma-jasmine'
        ]

    });
};
