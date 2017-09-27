// Karma configuration
// Generated on Mon Mar 13 2017 21:13:09 GMT+0800 (PHT)

module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [
            //Libraries
            'env.js',
            'templates/assets/global/plugins/jquery.min.js',
            'templates/assets/global/plugins/bootstrap/js/bootstrap.min.js',
            'node_modules/angular/angular.min.js',
            'node_modules/angular-animate/angular-animate.min.js',
            'node_modules/angular-resource/angular-resource.min.js',
            'node_modules/angular-ui-router/release/angular-ui-router.min.js',
            './node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
            'node_modules/async/dist/async.min.js',
            'node_modules/angular-cookie/angular-cookie.min.js',
            //'node_modules/ng-token-auth/dist/ng-token-auth.min.js',
            'node_modules/bootbox/bootbox.min.js',
            'node_modules/angular-auto-validate/dist/jcs-auto-validate.min.js',
            'node_modules/ngprogress-lite/ngprogress-lite.min.js',
            'node_modules/ladda/js/spin.js',
            'node_modules/ladda/js/ladda.js',
            'node_modules/angular-ladda/dist/angular-ladda.min.js',
            // 'node_modules/angular-ui-bootstrap/dist/ui-bootstrap.js',
            'node_modules/ng-file-upload/dist/ng-file-upload-shim.min.js',
            'node_modules/ng-file-upload/dist/ng-file-upload.min.js',
            'node_modules/angular-scroll/angular-scroll.min.js',
            'node_modules/angular-file-model/angular-file-model.js',
            'node_modules/angular-base64-upload/dist/angular-base64-upload.min.js',
            'node_modules/angular-mocks/angular-mocks.js',
            'node_modules/angular-drag-and-drop-lists/angular-drag-and-drop-lists.min.js',
            'templates/assets/global/scripts/app.js',
            'templates/assets/pages/scripts/components-date-time-pickers.js',

            'node_modules/froala-editor/js/froala_editor.min.js',
            'node_modules/froala-editor/js/plugins/align.min.js',
            'node_modules/froala-editor/js/plugins/colors.min.js',
            'node_modules/froala-editor/js/plugins/entities.min.js',
            'node_modules/froala-editor/js/plugins/font_family.min.js',
            'node_modules/froala-editor/js/plugins/font_size.min.js',
            'node_modules/froala-editor/js/plugins/image.min.js',
            'node_modules/froala-editor/js/plugins/image_manager.min.js',
            'node_modules/froala-editor/js/plugins/inline_style.min.js',
            'node_modules/froala-editor/js/plugins/line_breaker.min.js',
            'node_modules/froala-editor/js/plugins/link.min.js',
            'node_modules/froala-editor/js/plugins/lists.min.js',
            'node_modules/froala-editor/js/plugins/paragraph_format.min.js',
            'node_modules/froala-editor/js/plugins/paragraph_style.min.js',
            'node_modules/froala-editor/js/plugins/quote.min.js',
            'node_modules/froala-editor/js/plugins/save.min.js',
            'node_modules/froala-editor/js/plugins/table.min.js',
            'node_modules/froala-editor/js/plugins/code_view.min.js',
            'node_modules/froala-editor/js/plugins/code_beutifier.min.js',
            'node_modules/froala-editor/js/plugins/draggable.min.js',
            'node_modules/froala-editor/js/plugins/video.min.js',

            //Cores
            'app/core/app.module.js',
            'app/core/constants.js',
            'app/core/app.core.js',
            'app/core/app.config.js',
            'app/core/app.route.js',
            'app/core/app.helpers.js',
            'app/nav/*.js',
            'app/nav/*/*.js',

            //Common module
            'app/common/*.js',
            'app/common/*/*.js',

            //Auth Module
            'app/login/*.js',
            'app/login/*/*.js',
            'app/login/spec/unit/*.js',

            //Dashboard Module
            'app/dashboard/*.js',
            'app/dashboard/*/*.js',

            //Brand Module
            'app/brand/*.js',
            'app/brand/*/*.js',
            'app/brand/spec/unit/*.js',

            //Category Module
            'app/category/*.js',
            'app/category/*/*.js',
            'app/category/spec/unit/*.js',

            //Deal Module
            'app/deals/*.js',
            'app/deals/*/*.js',
            'app/deals/spec/unit/*.js',

            //Image Module
            'app/deals/image/*.html',
            'app/deals/image/*/*.js',

            //Video Module
            'app/deals/video/*.html',
            'app/deals/video/*/*.js',

            //Super Block Module
            'app/super_blocks/*.js',
            'app/super_blocks/*/*.js',
            'app/super_blocks/spec/unit/*.js',

            //User Module
            'app/user/*.js',
            'app/user/*/*.js',
            'app/user/spec/unit/*.js',

            //Rocket Deal Module
            'app/rocket_deals/*.html',
            'app/rocket_deals/*.js',
            'app/rocket_deals/*/*.js',
            'app/rocket_deals/spec/unit/*.js'
        ],


        // list of files to exclude
        exclude: [],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
        },

        ngHtml2JsPreprocessor: {
            // strip this from the file path
            //stripPrefix: 'app/',
            //stripSuffix: '.js.html', // I had to make a strip on the templatesCached

            //prependSuffix: '.html',
            //stripSuffix: '.ext',
            // prepend this to the
            //prependPrefix: '/Users/chuya/web projects/Code/launchii/angular-admin/',

            // or define a custom transform function
            // - cacheId returned is used to load template
            //   module(cacheId) will return template at filepath
            // cacheIdFromPath: function(filepath) {
            //     //console.log(config);
            //     return filepath;
            // },

            // - setting this option will create only a single module that contains templates
            //   from all the files, so you can load them all with module('foo')
            // - you may provide a function(htmlPath, originalPath) instead of a string
            //   if you'd like to generate modules dynamically
            //   htmlPath is a originalPath stripped and/or prepended
            //   with all provided suffixes and prefixes
            // moduleName: function(htmlPath, originalPath) {
            //     console.log(htmlPath);
            //     console.log(config.basePath);
            //     var s = htmlPath.split('/');
            //     return s[s.length - 1];
            //     //return htmlPath;
            // }
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['spec'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    })
}
