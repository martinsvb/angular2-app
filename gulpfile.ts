import * as gulp from 'gulp';
import * as util from 'gulp-util';
import * as runSequence from 'run-sequence';
import * as gulpLoadPlugins from 'gulp-load-plugins';

const plugins = <any>gulpLoadPlugins();

import Config from './tools/config';
import { loadTasks } from './tools/utils';

loadTasks(Config.SEED_TASKS_DIR);
loadTasks(Config.PROJECT_TASKS_DIR);


// --------------
// Build dev.
gulp.task('build.dev', (done: any) =>
  runSequence(//'clean.dev',
//              'tslint',
//              'css-lint',
              'build.assets.dev',
              'build.html_css',
              'build.js.dev',
              'build.index.dev',
              'ownExt',
              'cssDev',
              done));

// --------------
// Build dev watch.
gulp.task('build.dev.watch', (done: any) =>
  runSequence('build.dev',
              'watch.dev',
              done));

// --------------
// Build e2e.
gulp.task('build.e2e', (done: any) =>
  runSequence('clean.dev',
              'tslint',
              'build.assets.dev',
              'build.js.e2e',
              'build.index.dev',
              done));

// --------------
// Build prod.
gulp.task('build.prod', (done: any) =>
  runSequence('clean.prod',
              'tslint',
              'css-lint',
              'build.assets.prod',
              'build.html_css',
              'copy.prod',
              'build.js.prod',
              'build.bundles',
              'build.bundles.app',
              'minify.bundles',
              'build.index.prod',
              'ownExt',
              'cssProd',
              done));

// --------------
// Build prod.
gulp.task('build.prod.exp', (done: any) =>
  runSequence('clean.prod',
              'tslint',
              'css-lint',
              'build.assets.prod',
              'build.html_css',
              'copy.prod',
              'compile.ahead.prod',
              'build.js.prod.exp',
              'build.bundles',
              'build.bundles.app.exp',
              'minify.bundles',
              'build.index.prod',
              done));

// --------------
// Build test.
gulp.task('build.test', (done: any) =>
  runSequence('clean.once',
              'tslint',
              'build.assets.dev',
              'build.html_css',
              'build.js.dev',
              'build.js.test',
              'build.index.dev',
              done));

// --------------
// Build test watch.
gulp.task('test.watch', (done: any) =>
  runSequence('build.test',
              'watch.test',
              'karma.watch',
              done));

// --------------
// Build tools.
gulp.task('build.tools', (done: any) =>
  runSequence('clean.tools',
              'build.js.tools',
              done));

// --------------
// Docs
// gulp.task('docs', (done: any) =>
//   runSequence('build.docs',
//               'serve.docs',
//               done));

// --------------
// Serve dev
gulp.task('serve.dev', (done: any) =>
  runSequence('build.dev',
              'server.start',
              'watch.dev',
              done));

// --------------
// Serve e2e
gulp.task('serve.e2e', (done: any) =>
  runSequence('build.e2e',
              'server.start',
              'watch.e2e',
              done));


// --------------
// Serve prod
gulp.task('serve.prod', (done: any) =>
  runSequence('build.prod',
              'server.prod',
              done));


// --------------
// Test.
gulp.task('test', (done: any) =>
  runSequence('build.test',
              'karma.run',
              done));

// --------------
// Clean dev/coverage that will only run once
// this prevents karma watchers from being broken when directories are deleted
let firstRun = true;
gulp.task('clean.once', (done: any) => {
  if (firstRun) {
    firstRun = false;
    runSequence('clean.dev', 'clean.coverage', done);
  } else {
    util.log('Skipping clean on rebuild');
    done();
  }
});

// --------------
// Own extensions.
gulp.task('ownExt', (done: any) => {
  // Font-awesome
  gulp.src([
    './node_modules/font-awesome/fonts/*'
  ])
  .pipe(gulp.dest('./dist/dev/assets/fonts'))
  .pipe(gulp.dest('./dist/prod/assets/fonts'));

  // Images
  gulp.src([
    './src/client/assets/img*'
  ])
  .pipe(gulp.dest('./dist/dev/assets/fonts'))
  .pipe(gulp.dest('./dist/prod/assets/fonts'));  
  
  
  // Deploy summernote
  gulp.src([
    './node_modules/summernote/dist/font/*'
  ])
  .pipe(gulp.dest('./dist/dev/assets/fonts'))
  .pipe(gulp.dest('./dist/prod/assets/fonts'));

  gulp.src([
    './node_modules/summernote/dist/summernote.min.js',
    './node_modules/summernote/dist/lang/summernote-cs-CZ.min.js',
    './node_modules/summernote/dist/lang/summernote-sk-SK.min.js',
    './node_modules/summernote/dist/lang/summernote-hu-HU.min.js',
    './node_modules/summernote/dist/lang/summernote-pl-PL.min.js'
  ])
  .pipe(plugins.concat('summernote.js'))
  .pipe(gulp.dest('./dist/dev/js'))
  .pipe(gulp.dest('./dist/prod/js'));

  return gulp.src([
    './node_modules/summernote/dist/summernote.css'
  ])
  .pipe(plugins.replace('url("font', 'url("../assets/fonts'))
  .pipe(gulp.dest('./dist/dev/css'))
  .pipe(gulp.dest('./dist/prod/css'));
});

// --------------
// Merge prod CSS to main.css prod.
gulp.task('cssProd', (done: any) => 
  gulp.src('./dist/prod/css/*.css')
  .pipe(plugins.concatCss('main.css'))
  .pipe(gulp.dest('./dist/prod/css'))
);

// --------------
// Merge dev CSS to main.css dev.
gulp.task('cssDev', (done: any) => 
  gulp.src('./dist/dev/css/*.css')
  .pipe(plugins.concatCss('main.css'))
  .pipe(gulp.dest('./dist/dev/css'))
);
