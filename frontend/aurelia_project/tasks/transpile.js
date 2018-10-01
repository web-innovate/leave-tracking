import gulp from 'gulp';
import changedInPlace from 'gulp-changed-in-place';
import plumber from 'gulp-plumber';
import babel from 'gulp-babel';
import sourcemaps from 'gulp-sourcemaps';
import notify from 'gulp-notify';
import rename from 'gulp-rename';
import project from '../aurelia.json';
import {CLIOptions, build} from 'aurelia-cli';
import modifyFile from 'gulp-modify-file';

function configureEnvironment() {
  let env = CLIOptions.getEnvironment();

  return gulp.src(`aurelia_project/environments/${env}.js`)
    .pipe(changedInPlace({firstPass: true}))
    .pipe(rename('environment.js'))
    .pipe(modifyFile((content, path, file) => {
        const api_url = CLIOptions.getFlagValue('api_url');

        return `${content.replace(
          'API_URL: \'API_REPLACE\'',
          `API_URL: \'${api_url}\'`)}`
    }))
    .pipe(gulp.dest(project.paths.root));
}

function buildJavaScript() {
  return gulp.src(project.transpiler.source)
    .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
    .pipe(changedInPlace({firstPass: true}))
    .pipe(sourcemaps.init())
    .pipe(babel(project.transpiler.options))
    .pipe(build.bundle());
}

export default gulp.series(
  configureEnvironment,
  buildJavaScript
);
