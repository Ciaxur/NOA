// Module Imports
const gulpCore          = require('./gulp-core');
const sourcemaps        = require('gulp-sourcemaps');
const ts                = require('gulp-typescript');

// Assign Modules From Gulp-Core
const gulp      = gulpCore.gulp;
const gutil     = gulpCore.gutil;

/** Builds Typescript Files from src Directory */
function build_TS(done) {
    // Create TS Config
    const tsConfig = ts.createProject('tsconfig.json');
    const tsReporter = ts.reporter.emptyCompilationResult();        // Display Error w/o Breaking

    // Run & Return Build
    gulp.src('src/**/*.?s')             // Import TS Files
        .pipe(sourcemaps.init())        // Initiate Source Mapping
        .pipe(tsConfig(tsReporter))     // Run the TS Config based on JSON File Compile
        .on('error', gutil.log)         // Log only Errors that occur
        .pipe(sourcemaps.write('./'))   // Write out Source Maps
        .pipe(gulp.dest('out'));        // Output Results to 'out' directory

    // Announce Async Complete
    // Just tells Gulp this function is done ;)
    done();
};

gulp.task('build:typescript', build_TS);



/** Moves '.html' files UNTOUCHED from 'src' Directory */
function move_HTML(done) {
    gulp.src('src/**/*.html')
        .pipe(gulp.dest('out'));
    done();
};
gulp.task('move:html', move_HTML);



/** Moves '.css' files UNTOUCHED from 'src' Directory */
function move_CSS(done) {
    gulp.src('src/**/*.css')
        .pipe(gulp.dest('out'));

    done();
};
gulp.task('move:css', move_CSS);




// Parallel Tasks
/**
 * Builds Typescript Files from src Directory
 *  Outputs into the 'out' directory
 *  Moves HTML UNTOUCHED
 */
gulp.task('build:all', gulp.parallel('build:typescript', 'move:html', 'move:css'));