'use strict';

const gulp = require('gulp');  
const fs = require('fs');
const sass = require('gulp-sass');  
const revAll = require('gulp-rev-all');
const revRewrite = require('gulp-rev-rewrite');
const rimraf = require('rimraf');
const recursive = require('recursive-readdir');
const browserSync = require('browser-sync').create();
const config = require('./config/config');
const assets = 'src/assets/';
const distAssets = 'src/dist/assets/';
const views = 'src/views/';
const distViews = 'src/dist/views/';
const manifest = 'src/dist/manifest/rev-manifest.json';

gulp.task('sass', function(done) {  
    gulp.src(assets + 'scss/**/*.scss')
        .pipe(sass({includePaths: [assets + 'scss'], outputStyle: 'compressed'}))
        .on('error', function(error) {
            console.error('\x1b[31m\x1b[1m' + error.messageFormatted + '\x1b[0m');
            done(error); 
        })
        .pipe(gulp.dest(assets + 'css'));
    done();
});

gulp.task('rev', function(done) {
    if (fs.existsSync(manifest)) {
        const previousRevisions = require('./' + manifest);
        const manifestFiles = [];
        for (let r in previousRevisions) {
            const filePath = (distAssets + previousRevisions[r]).replace(/\//g, '\\'); 
            manifestFiles.push(filePath);
        }
        recursive(distAssets, manifestFiles, (err, files) => {
            if (err) {
                console.log(err);
            }
        
            if (files)
                files.forEach(file => {
                    try {
                        fs.unlinkSync(file);
                    } catch (ex) {
                        console.log(ex);
                    }
                });
        });
    }
    return gulp.src(assets + '**/*')
        .pipe(revAll.revision({
            includeFilesInManifest: [
                '.css', '.js', '.png', '.jpg', '.svg', '.gif',
                '.ttf', '.woff', '.eot'
            ],
            dontRenameFile: [/favicon\.ico/g, /\.mult/g]
        }))
        .on('error', function(error) {
            console.error('\x1b[31m\x1b[1m' + error + '\x1b[0m');
            done(error); 
        })
        .pipe(gulp.dest(distAssets))
        .pipe(revAll.manifestFile())
        .on('error', function(error) {
            console.error('\x1b[31m\x1b[1m' + error + '\x1b[0m');
            done(error); 
        })
        .pipe(gulp.dest('src/dist/manifest'))
        .on('end', function() {
            console.log('Recompiled distributables and updated manifest.');
            done();
        });
});

gulp.task('rewrite', function(done) {
    return gulp.src(views + '**/*.hjs')
        .pipe(revRewrite({manifest: gulp.src(manifest) }))
        .on('error', function(error) {
            console.error('\x1b[31m\x1b[1m' + error + '\x1b[0m');
            done(error); 
        })
        .pipe(gulp.dest(distViews))
        .on('end', () => {
            console.log('Updated references in .hjs files.');
            done();
        });
});

gulp.task('reload', function(done) {
    browserSync.reload();
    done();
});

gulp.task('serve', gulp.series(['sass', 'rev', 'rewrite'], function() {
    browserSync.init({
        proxy: {
            target: 'localhost:3000'
        },
        baseDir: './',
        open: true,
        notify: false,
        watch: true,
        reloadDebounce: 500
    });

    const delay = 250;
    gulp.watch(assets + 'scss/**/*.scss', { delay }, gulp.series(['sass', 'rev', 'rewrite', 'reload']));
    gulp.watch(assets + 'css/**/*.css', { delay }, gulp.series(['rev', 'rewrite', 'reload']));
    gulp.watch(assets + 'files/**/*', { delay }, gulp.series(['rev', 'rewrite', 'reload']));
    gulp.watch(assets + 'js/**/*.js', { delay }, gulp.series(['rev', 'rewrite', 'reload']));
    gulp.watch(views + '**/*.hjs', { delay }, gulp.series(['rev', 'rewrite', 'reload']));
}));

if (config.application.environment === 'local') {
    if (fs.existsSync('src/dist')) {
        rimraf.sync('src/dist');
        console.log('Removed existing distributables.');
    }
    if (!process.env.SKIP_BROWSER_SYNC) {
        gulp.task('default', gulp.series(['serve']));
    } else {
        gulp.task('default', gulp.series(['sass', 'rev', 'rewrite']));
    }
}
else if (config.application.environment === 'prod')
    gulp.task('default', gulp.series(['rev', 'rewrite']));