// Module Imports
const gulp          = require('gulp');
const del           = require('del');


/** Cleans 'dist' directory */
function clean_Dist(done) { 
    del(['dist/*']);

    done();
}

/** Cleans 'out' directory */
function clean_Out(done) {
    del(['out/*']);
    done();
}


// Assign Tasks
gulp.task('clean:dist', clean_Dist);
gulp.task('clean:out', clean_Out);


/** 
 * Runs ALL Clean Tasks in Parallel
 *  'out' directory cleanup     -> clean:out
 *  'dist' directory cleanup    -> clean:dist
 */
gulp.task('clean:all', gulp.parallel('clean:dist', 'clean:out'));


