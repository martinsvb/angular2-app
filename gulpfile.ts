import * as gulp from 'gulp';
import * as runSequence from 'run-sequence';
import * as gulpLoadPlugins from 'gulp-load-plugins';

import { PROJECT_TASKS_DIR, SEED_TASKS_DIR } from './tools/config';
import { loadTasks } from './tools/utils';

loadTasks(SEED_TASKS_DIR);
loadTasks(PROJECT_TASKS_DIR);

const plugins = <any>gulpLoadPlugins();

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
              'font-awesome.copy',
              'img.copy',
              'summernote',
              'mergeCssDev',
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
              'copy.js.prod',
              'build.js.prod',
              'build.bundles',
              'build.bundles.app',
              'build.index.prod',
              'server.copy',
              'font-awesome.copy',
              'img.copy',
              'summernote',
              'summernoteCssProd',
              done));

// --------------
// Build prod. fast without linting
gulp.task('build.prod.fast', (done: any) =>
  runSequence('clean.prod',
              'build.assets.prod',
              'build.html_css',
              'copy.js.prod',
              'build.js.prod',
              'build.bundles',
              'build.bundles.app',
              'build.index.prod',
              'server.copy',
              'font-awesome.copy',
              'img.copy',
              'summernote',
              'summernoteCssProd',
              done));

// --------------
// Copy server to prod folder.
gulp.task('server.copy', (done: any) =>
  gulp.src('./server/*')
      .pipe(gulp.dest('./dist/prod'))
);

// --------------
// Copy font-awesome.
gulp.task('font-awesome.copy', (done: any) =>
  gulp.src([
    './node_modules/font-awesome/fonts/*'
  ])
  .pipe(gulp.dest('./dist/dev/assets/fonts'))
  .pipe(gulp.dest('./dist/prod/assets/fonts'))
);

// --------------
// Copy img.
gulp.task('img.copy', (done: any) =>
  gulp.src([
    './src/client/assets/img*'
  ])
  .pipe(gulp.dest('./dist/dev/assets/fonts'))
  .pipe(gulp.dest('./dist/prod/assets/fonts'))
);

// --------------
// Deploy summernote.
gulp.task('summernote', (done: any) => {
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
// Merge summernote CSS to main.css prod.
gulp.task('summernoteCssProd', (done: any) => 
  gulp.src('./dist/prod/css/*.css')
  .pipe(plugins.concatCss('main.css'))
  .pipe(gulp.dest('./dist/prod/css'))
);

// --------------
// Merge dev CSS to main.css dev.
gulp.task('mergeCssDev', (done: any) => 
  gulp.src('./dist/dev/css/*.css')
  .pipe(plugins.concatCss('main.css'))
  .pipe(gulp.dest('./dist/dev/css'))
);

// --------------
// Build test.
gulp.task('build.test', (done: any) =>
  runSequence('clean.dev',
              'tslint',
              'build.assets.dev',
              'build.js.test',
              'build.index.dev',
              done));

// --------------
// Build test watch.
gulp.task('build.test.watch', (done: any) =>
  runSequence('build.test',
              'watch.test',
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
// Serve prod
gulp.task('serve.prod.fast', (done: any) =>
  runSequence('build.prod.fast',
              'server.prod',
              done));


// --------------
// Test.
gulp.task('test', (done: any) =>
  runSequence('build.test',
              'karma.start',
              done));
