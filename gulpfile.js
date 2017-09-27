var gulp = require('gulp'),
    concat = require('gulp-concat'),
    watch = require('gulp-watch'),
    inject = require('gulp-inject'),
    browserSync = require('browser-sync').create(),
    protractor = require("gulp-protractor").protractor;

var files = [
    //Libraries
    './node_modules/angular/angular.min.js',
    './node_modules/angular-animate/angular-animate.min.js',
    './node_modules/angular-resource/angular-resource.min.js',
    './node_modules/angular-ui-router/release/angular-ui-router.min.js',
    './node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
    './node_modules/async/dist/async.min.js',
    './node_modules/angular-cookie/angular-cookie.min.js',
    // './node_modules/ng-token-auth/dist/ng-token-auth.min.js',
    './node_modules/bootbox/bootbox.min.js',
    './node_modules/angular-auto-validate/dist/jcs-auto-validate.min.js',
    './node_modules/ngprogress-lite/ngprogress-lite.min.js',
    './node_modules/ladda/js/spin.js',
    './node_modules/ladda/js/ladda.js',
    './node_modules/angular-ladda/dist/angular-ladda.min.js',
    // './node_modules/angular-ui-bootstrap/dist/ui-bootstrap.js',
    './node_modules/ng-file-upload/dist/ng-file-upload-shim.min.js',
    './node_modules/ng-file-upload/dist/ng-file-upload.min.js',
    './node_modules/angular-scroll/angular-scroll.min.js',
    './node_modules/angular-file-model/angular-file-model.js',
    './node_modules/angular-base64-upload/dist/angular-base64-upload.min.js',
    './node_modules/chosen-js/chosen.jquery.js',
    './node_modules/angular-chosen-localytics/dist/angular-chosen.min.js',
    './node_modules/angular-drag-and-drop-lists/angular-drag-and-drop-lists.min.js',
    './node_modules/froala-editor/js/froala_editor.min.js',
    './node_modules/froala-editor/js/plugins/align.min.js',
    './node_modules/froala-editor/js/plugins/colors.min.js',
    './node_modules/froala-editor/js/plugins/entities.min.js',
    './node_modules/froala-editor/js/plugins/font_family.min.js',
    './node_modules/froala-editor/js/plugins/font_size.min.js',
    './node_modules/froala-editor/js/plugins/image.min.js',
    './node_modules/froala-editor/js/plugins/image_manager.min.js',
    './node_modules/froala-editor/js/plugins/inline_style.min.js',
    './node_modules/froala-editor/js/plugins/line_breaker.min.js',
    './node_modules/froala-editor/js/plugins/link.min.js',
    './node_modules/froala-editor/js/plugins/lists.min.js',
    './node_modules/froala-editor/js/plugins/paragraph_format.min.js',
    './node_modules/froala-editor/js/plugins/paragraph_style.min.js',
    './node_modules/froala-editor/js/plugins/quote.min.js',
    './node_modules/froala-editor/js/plugins/save.min.js',
    './node_modules/froala-editor/js/plugins/table.min.js',
    './node_modules/froala-editor/js/plugins/code_view.min.js',
    './node_modules/froala-editor/js/plugins/code_beautifier.min.js',
    './node_modules/froala-editor/js/plugins/draggable.min.js',
    './node_modules/froala-editor/js/plugins/video.min.js',

    //Cores
    './app/core/app.module.js',
    './app/core/constants.js',
    './app/core/app.core.js',
    './app/core/app.config.js',
    './app/core/app.route.js',
    './app/core/app.helpers.js',
    './app/nav/*.js',
    './app/nav/*/*.js',

    //Common Module
    './app/common/*.js',
    './app/common/*/*.js',

    //Auth Module
    './app/login/*.js',
    './app/login/*/*.js',

    //Dashboard Module
    './app/dashboard/*.js',
    './app/dashboard/*/*.js',

    //Brand Module
    './app/brand/*.js',
    './app/brand/*/*.js',

    //Category Module
    './app/category/*.js',
    './app/category/*/*.js',

    //Rocket Deal Module
    './app/rocket_deals/*.js',
    './app/rocket_deals/*/*.js',

    //Rocket Deal Pending Module
    './app/rocket_deals/pending/*.js',
    './app/rocket_deals/pending/*/*.js',

    //Deal Module
    './app/deals/*.js',
    './app/deals/*/*.js',

    //Image Module
    './app/deals/image/*.js',
    './app/deals/image/*/*.js',

    //Video Module
    './app/deals/video/*.js',
    './app/deals/video/*/*.js',

    //Deal Pending Module
    './app/deals/pending/*.js',
    './app/deals/pending/*/*.js',

    //Super Block Module
    './app/super_blocks/*.js',
    './app/super_blocks/*/*.js',

    //User Module
    './app/user/*.js',
    './app/user/*/*.js',

];

gulp.task('scripts', function() {
    return gulp.src(files)
        .pipe(concat('all.js'))
        .pipe(gulp.dest('./dist/js/'));
});

gulp.task('js-watch', function() {
    gulp.watch(files, ['scripts']);
});

gulp.task('inject', function() {
    return gulp.src('./index.html')
          .pipe(inject(gulp.src(files, {read: false}), {relative: true}))
          .pipe(gulp.dest('./'));
});

gulp.task('dev-watch', ['inject'], function() {

    browserSync.instance = browserSync.init({
        startPath: '/',
        server: {
            baseDir: "./"
        },
        port: 8080
    });

    gulp.watch(files, ['inject']);
    gulp.watch(files).on('change', browserSync.reload);
});


gulp.task('e2e', function(done) {
  var args = ['--baseUrl', 'http://127.0.0.1:8080'];
  gulp.src(["./tests/e2e/*.js"])
    .pipe(protractor({
      configFile: "protractor.conf.js",
      args: args
    }))
    .on('error', function(e) { throw e; });
});
