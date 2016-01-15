import gulp from 'gulp'
import del from 'del'
import browserSync from 'browser-sync'
import runSequence from 'run-sequence'
import sass from 'gulp-sass'
import postcss from 'gulp-postcss'
import normalizeCss from 'postcss-normalize'
import cssnano from 'cssnano'
import autoprefixer from 'autoprefixer'
import clearfix from 'postcss-clearfix'
import calc from 'postcss-calc'
import assets from 'postcss-assets'
import stylelint from 'stylelint'
import reporter from 'postcss-reporter'
import browserify from 'browserify'
import babelify from 'babelify'
import source from 'vinyl-source-stream'
import buffer from 'vinyl-buffer'

//import { app } from './assemblefile'

import path from 'path'
import assemble from 'assemble'
import extname from 'gulp-extname'

const app = assemble()

app.task('init', (cb) => {
  app.layouts(path.join(__dirname, './src/layouts/**/*.hbs'))
  app.partials(path.join(__dirname, './src/partials/**/*.hbs'))
  app.pages(path.join(__dirname, './src/pages/**/*.hbs'))
  cb()
})

app.task('content', ['init'], () => {
  return app.toStream('pages')
    .on('err', console.error)
    .pipe(app.renderFile())
    .on('err', console.error)
    .pipe(extname())
    .pipe(app.dest(path.join(__dirname, './dist')))
})

app.task('default', ['content'])


gulp.task('clean', (done) => {
  del(['./dist'])
    .then(() => {
      done()
    })
})

gulp.task('template', () => {
  app.build('default')
})

gulp.task('scss', () => {

  return gulp
    .src(['./src/scss/*.scss'])
    .pipe(sass())
    .pipe(gulp.dest('./tmp/css'))
})

gulp.task('style', ['scss'], () => {

  return gulp
    .src(['./tmp/css/*.css'])
    .pipe(postcss([
      normalizeCss(),
      clearfix(),
      calc(),
      assets(),
      stylelint(),
      autoprefixer(),
      cssnano(),
      reporter()
    ]))
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.stream())
})

gulp.task('script', () => {

  const bundler = browserify('./src/js/app.jsx', {
    debug: true
  }).transform(babelify, {
    'presets': ['es2015', 'react'],
    'plugins': ['transform-object-assign']
  })

  function rebundle () {
    bundler
      .bundle()
      .on('error', function (err) {
        console.error(err); this.emit('end');
      })
      .pipe(source('app.js'))
      .pipe(buffer())
      .pipe(gulp.dest('./dist/js'));
  }

  bundler.on('update', function () {
    console.log('-> bundling...');
    rebundle();
  });

  rebundle();
})

gulp.task('compile', ['template', 'style', 'script'])

gulp.task('serve', () => {
  runSequence('clean', ['compile'], () => {
    browserSync.init({
      server: './dist',
      open: false
    })
  })

  gulp
    .watch(['./dist/*.html'])
    .on('change', browserSync.reload);

  gulp.watch(['./src/**/*.hbs'], ['template'])
  gulp.watch(['./src/scss/**/*.scss'], ['style'])
  gulp.watch(['./src/js/**/*.{js,jsx}'], ['script'])
})

gulp.task('build', () => {
  runSequence('clean', 'compile', () => {
  })
})
