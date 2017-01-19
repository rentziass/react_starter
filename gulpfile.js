var gulp = require('gulp');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify');
var notifier = require('node-notifier');
var server = require('gulp-server-livereload');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var watch = require('gulp-watch');

var notify = function(error) {
  var message = 'In: ';
  var title = 'Error: ';

  if(error.description) {
    title += error.description;
  } else if (error.message) {
    title += error.message;
  }

  if(error.filename) {
    var file = error.filename.split('/');
    message += file[file.length-1];
  }

  if(error.lineNumber) {
    message += '\nOn Line: ' + error.lineNumber;
  }

  notifier.notify({title: title, message: message});
};

var bundler = watchify(browserify({
  entries: ['./src/jsx/app.jsx'],
  transform: [reactify],
  extensions: ['.jsx'],
  debug: true,
  cache: {},
  packageCache: {},
  fullPaths: true
}));

function bundle(file) {
  if (file) gutil.log('Recompiling ' + file);
  return bundler
    .bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify error'))
    .pipe(source('main.js'))
    .pipe(gulp.dest('./www/js'));
}
bundler.on('update', bundle);

gulp.task('build', function() {
  bundle()
});

gulp.task('serve', function(done) {
  gulp.src('')
    .pipe(server({
      livereload: {
        enable: true,
        filter: function(filePath, cb) {
          if(/main.js/.test(filePath)) {
            cb(true)
          } else if(/style.css/.test(filePath)){
            cb(true)
          }
        }
      },
      open: false
    }));
});

gulp.task('sass', function () {
  gulp.src('src/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('style.css'))
    .pipe(gulp.dest('./www/css'));
});

gulp.task('default', ['build', 'serve', 'sass', 'watch']);

gulp.task('watch', function () {
  gulp.watch('src/sass/**/*.scss', ['sass']);
});

// var gulp = require ('gulp');
// var gutil = require ('gulp-util');
// var source = require ('vinyl-source-stream');
// var browserify = require ('browserify');
// var watchify = require ('watchify');
// var reactify = require ('reactify');
//
// gulp.task('default', function(){
//   var bundler = watchify(browserify({
//     entries: ['./src/jsx/app.jsx'],
//     transform: [reactify],
//     extensions: ['.jsx'],
//     debug: true,
//     cache: {},
//     packageCache: {},
//     fullPaths: true
//   }))
//
//   function build(file) {
//     if (file) gutil.log('Recompiling ' + file);
//     return bundler
//       .bundle()
//       .on('error', gutil.log.bind(gutil, 'Browserify error'))
//       .pipe(source('main.js'))
//       .pipe(gulp.dest('./www/js'));
//   };
//   build()
//   bundler.on('update', build)
// });
