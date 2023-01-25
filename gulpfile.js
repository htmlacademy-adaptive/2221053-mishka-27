import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import csso from 'postcss-csso';
import rename from 'gulp-rename';
import autoprefixer from 'autoprefixer';
import browser from 'browser-sync';
import htmlmin from 'gulp-htmlmin';
import terser from 'gulp-terser';
import squoosh from 'gulp-libsquoosh';
import svgo from 'gulp-svgo';
import svgstore from 'gulp-svgstore';
import {deleteAsync as del} from 'del';

// Styles

export const styles = () => {
  return gulp.src('source/sass/style.scss', { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

//HTML

const html = () => {
  return gulp.src('source/*.html')
  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(gulp.dest('build'));
}

//Scripts

const scripts = () => {
  return gulp.src('source/js/*.js')
  .pipe(terser())
  .pipe(gulp.dest('build/js'));
}

//Images

const optimizeImg = () => {
  return  gulp.src('source/img/**/*.{jpg,png}')
  .pipe(squoosh())
  .pipe(gulp.dest('build/img'));
}

const copyImg = () => {
  return  gulp.src('source/img/**/*.{jpg,png}')
  .pipe(gulp.dest('build/img'));
}

//WebP

const createWebp = () => {
  return gulp.src('source/img/**/*.jpg')
  .pipe(squoosh({
    webp:[]
  }))
  .pipe(gulp.dest('build/img'));
}

//SVG

const svg = () => {
  return gulp.src(['source/img/*.svg', 'source/img/ico/*.svg', '!source/img/ico/*-ico.svg'])
  .pipe(svgo())
  .pipe(gulp.dest('build/img'));
}

export const sprite = () => {
  return gulp.src('source/img/ico/*-ico.svg')
  .pipe(svgo())
  .pipe(svgstore({
    inLineSvg: true
  }))
  .pipe(rename('sprite.svg'))
  .pipe(gulp.dest('build/img'));
}

//Copy

const copy = () => {
  return gulp.src([
    'source/fonts/*.{woff,woff2}',
    'source/*.ico'
  ], {
    base: 'source'
  })
  .pipe(gulp.dest('build/fonts'))
  done();
}

//Clean

const clean = () => {
  return del('build')
}

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

//Reload

const reload = (done) => {
  browser.reload();
  done();
}

// Watcher

const watcher = () => {
  gulp.watch('source/sass/**/*.scss', gulp.series(styles));
  gulp.watch('source/*.html', gulp.series(html), reload);
}

//Build

export const build = gulp.series(
  clean,
  copy,
  optimizeImg,
  gulp.parallel(
    styles,
    html,
    scripts,
    svg,
    sprite,
    createWebp
  )
)

export default gulp.series(
//  clean,
  copy,
  copyImg,
  gulp.parallel(
    styles,
    html,
    scripts,
    svg,
    sprite,
    createWebp
  ),
  gulp.series(
    server,
    watcher
  )
);
