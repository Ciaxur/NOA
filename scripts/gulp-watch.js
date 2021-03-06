// Module Imports
const gulp = require('gulp');


/** 
 * Watch Task for Building Typescript on-change 
 *  1 - Runs 'build:typescript'
 *  2 - Watches fro changes in 'src'
 *  3 - Rns 'build:typescript' on change
 */
function watch_TS(done) {
    gulp.watch('src/**/*', gulp.parallel('build:all'));
    done();
}
gulp.task('watch:typescript', watch_TS);
