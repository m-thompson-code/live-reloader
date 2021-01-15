const { task } = require('gulp');
const gulp = require('gulp');
// const nodemon = require('nodemon');
const { createServer } = require('.');
// const browserSync = require('browser-sync').create();

console.log("gulpfile.js START");

const server = createServer();
const io = server.io;

gulp.task('watch-client', done => {
    console.log(" ~ emit livereload event");
    io.emit('live-refresh', {timestamp: Date.now(), source: 'client-update-detected'});
    done();
});

gulp.task('default', () => {
    gulp.watch("app/**/*", gulp.series(['watch-client']));
});

console.log("gulpfile.js END");
