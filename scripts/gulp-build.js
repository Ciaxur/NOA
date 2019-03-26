// Module Imports
const gulp              = require('gulp');
const sourcemaps        = require('gulp-sourcemaps');
const ts                = require('gulp-typescript');
const plumber           = require('gulp-plumber');      // Handles Pipe Errors w/o Crashing

const tslint = require('gulp-tslint');
const reporter = require('gulp-reporter');


/** Builds Typescript Files from src Directory */
function build_TS(done) {
    // Create TS Config
    const tsProject = ts.createProject('tsconfig.json');
    const tsReporter = ts.reporter.defaultReporter();        // Display Default Report

    // Run & Return Build
    gulp.src('src/**/*.?s')                         // Import TS Files
        .pipe(plumber())               // Handle Pipe Breaking Errors
        .pipe(sourcemaps.init())                    // Initiate Source Mapping
        .pipe(tsProject(tsReporter))                // Run the TS Config based on JSON File Compile
        .pipe(sourcemaps.write('./'))               // Write out Source Maps
        .pipe(gulp.dest('out'));                    // Output Results to 'out' directory

    
    // Announce Async Complete
    // Just tells Gulp this function is done ;)
    done();
}

/** Moves '.html' files UNTOUCHED from 'src' Directory */
function move_HTML(done) {
    gulp.src('src/**/*.html')
        .pipe(gulp.dest('out'));
    done();
}

/** Moves '.css' files UNTOUCHED from 'src' Directory */
function move_CSS(done) {
    gulp.src('src/**/*.css')
        .pipe(gulp.dest('out'));

    done();
}

/** Lints Typescript Files using Config Files Povided */
function lint_TS(done) {
    // Create Configurations
    const lintConfig = {
        configuration: '.vscode/tslint.json',
        formatter: "verbose"
    };
    
    
    // Run Linting
    gulp.src('src/**/*.ts')
        .pipe(tslint(lintConfig))
        .pipe(reporter())
        .on('error', reporter);

    done();
}



// Regular Tasks
gulp.task('build:typescript', build_TS);
gulp.task('lint:typescript', lint_TS);
gulp.task('move:html', move_HTML);
gulp.task('move:css', move_CSS);



// Parallel Tasks
/**
 *  Lints Typescript files
 *  Builds Typescript Files from src Directory
 *  Outputs into the 'out' directory
 *  Moves HTML and CSS UNTOUCHED
 */
gulp.task('build:all', gulp.parallel('lint:typescript', 'build:typescript', 'move:html', 'move:css'));