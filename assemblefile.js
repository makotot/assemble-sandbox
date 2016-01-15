import path from 'path'
import assemble from 'assemble'
import extname from 'gulp-extname'

export const app = assemble()

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
