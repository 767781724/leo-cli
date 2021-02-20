const gulp = require('gulp');
const babel = require('gulp-babel');
const gulpHtml = require('gulp-htmlmin');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const path = require('path');
const argv = require('minimist')(process.argv.slice(2));
const del =require('del');
const autoprefixer = require('gulp-autoprefixer');
const cssmin = require('gulp-cssmin');
const rename = require('gulp-rename');
const connect = require('gulp-connect');
const { outputPath, publicPath, getEntry } = require('../../../config/path');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const tsify = require('tsify');
const buffer = require('vinyl-buffer');
const sourcemaps = require('gulp-sourcemaps');
const gutil = require('gulp-util');
const gulpif = require('gulp-if');

let project=null;

if (argv.hasOwnProperty('project')) {
  project=argv['project'];
} else {
  throw new Error('Missing parameters');
}
const BUILD_IS_DEBUG=process.env.NODE_ENV === 'development'?true:false;

const paths = {
  styles: {
    src: `${publicPath}/${project}/pages/**/*.scss`,
    dest: path.join(outputPath, project),
  },
  scripts: {
    src: `${publicPath}/${project}/pages/**/*.ts`,
    dest: path.join(outputPath, project),
  },
  htmls: {
    src: `${publicPath}/${project}/pages/**/*.html`,
    dest: path.join(outputPath, project),
  },
  assets: {
    src: `${publicPath}/${project}/pages/**/*.{gif,png,jpg,eot,woff,ttf,pdf,json,ico}`,
    dest: path.join(outputPath, project),
  },
};
gulp.task('clean', (done) => {
  del.sync([paths.styles.dest], { force: true });
  done();
});
// html文件打包
gulp.task('htmlmin', (done) => {
  gulp.src(paths.htmls.src)
      .pipe(gulpHtml({
        collapseWhitespace: true, // 删除空格
        removeComments: true, // 删除注释
      }))
      .pipe(gulp.dest(paths.htmls.dest))
      .pipe(connect.reload());
  done();
});
// babel读取配置打包
// gulp.task('babel', (done) => {
//   gulp.src(paths.scripts.src)
//       .pipe(babel(config))
//       .pipe(uglify())
//       .pipe(gulp.dest(paths.scripts.dest))
//       .pipe(connect.reload());
//   done();
// });
// browserify 浏览器兼容
gulp.task('browserify', (done)=>{
  const entry=getEntry(project);
  for (const key in entry) {
    if (Object.hasOwnProperty.call(entry, key)) {
      const val = entry[key];
      browserify({
        debug: false,
        entries: val,
        cache: {},
        packageCache: {},
      }).plugin(tsify)
          .bundle()
          .pipe(source('bundle.js'))
          .pipe(buffer())
          .pipe(sourcemaps.init({ loadMaps: BUILD_IS_DEBUG }))
          .pipe(gulpif(BUILD_IS_DEBUG===false, uglify()))
          .on('error', gutil.log)
          .pipe(gulpif(BUILD_IS_DEBUG, sourcemaps.write('./')))
          .pipe(gulp.dest(paths.scripts.dest+`/${key}`));
    }
  }
  connect.reload();
  done();
});
// scss转换打包
gulp.task('cssmin', (done)=>{
  gulp.src(paths.styles.src)
      .pipe(sass().on('error', sass.logError))
      .pipe(autoprefixer())
      .pipe(cssmin())
      .pipe(rename({ suffix: '.min' }))
      .pipe(gulp.dest(paths.styles.dest))
      .pipe(connect.reload());
  done();
});
// copy静态资源
gulp.task('static_file', (done)=>{
  gulp.src(paths.assets.src)
      .pipe(gulp.dest(paths.assets.dest))
      .pipe(connect.reload());
  done();
});

gulp.task('devServer', function() {
  connect.server({
    root: 'app',
    livereload: true,
    root: path.join(publicPath, project),
  });
});

gulp.task('default', gulp.series(['clean'],
    gulp.parallel(['htmlmin', 'browserify', 'cssmin', 'static_file'])),
);

gulp.task('watch', (done) => {
  connect.server({
    root: 'app',
    livereload: true,
    root: path.join(outputPath, project),
    debug: BUILD_IS_DEBUG,
  });
  gulp.watch([paths.htmls.src], gulp.series(['htmlmin']) );
  gulp.watch([paths.styles.src], gulp.series(['cssmin']) );
  gulp.watch([paths.scripts.src], gulp.series(['browserify']) );
  gulp.watch([paths.assets.src], gulp.series('static_file') );
  done();
});

gulp.task('server', gulp.series(['default', 'watch']));

