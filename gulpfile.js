"use strict";
const gulp = require('gulp');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const minifyCss = require("gulp-minify-css");
const concat = require('gulp-concat');
const cssAutoPrefixer = require('gulp-autoprefixer');
//const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const zip = require('gulp-zip');
const gzip = require('gulp-gzip');
const sourcemaps = require('gulp-sourcemaps');
const liveReload = require('gulp-livereload');
/* Image minification plugins */
const imageMin = require('gulp-imagemin');
const pngQuaint = require('imagemin-pngquant');
const jpegRecompress = require('imagemin-jpeg-recompress');
const DIST_PATH = `public/dist`;
const IMAGES_PATH = `public/images/**/*, {png, jpeg, jpg, svg, gif}`;
const SCRIPTS_PATH = `dev_js/*.js`;
const STYLES_PATH = `dev_css/*.css`;
const SASS_PATH = "sass/**/*.scss";
/* Styles */
gulp.task("styles", function() {
	return gulp.src(["dev_css/reset.css", STYLES_PATH])
		.pipe(plumber(function(err) {
			console.log("Styles Error:")
			console.log(err);
			this.emit('end');
		}))
		.pipe(sourcemaps.init())
		.pipe(cssAutoPrefixer())
		.pipe(concat("styles.css"))
		.pipe(minifyCss())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest("public/dist/css"))
		.pipe(liveReload());
});
/* Gulp with SASS */
// gulp.task("styles_sass", function() {
// 	return gulp.src(SASS_PATH)
// 		.pipe(plumber(function(err) {
// 			console.log("Styles Error:")
// 			console.log(err);
// 			this.emit('end');
// 		}))
// 		.pipe(sourcemaps.init())
// 		.pipe(cssAutoPrefixer())
// 		.pipe(concat("styles.css"))
// 		.pipe(sass({
// 			outputStyle: "compressed"
// 		}))
// 		.pipe(sourcemaps.write())
// 		.pipe(gzip())
// 		.pipe(gulp.dest("public/dist/css/styles.css"))
// 		.pipe(liveReload());
// });
/* Scripts */
gulp.task("scripts", function() {
	return gulp.src(SCRIPTS_PATH)
		.pipe(plumber(function(err) {
			console.log("Javascript Error:")
			console.log(err);
			this.emit('end');
		}))
		.pipe(sourcemaps.init())
		.pipe(babel({
			presets: ["es2015"]
		}))
		.pipe(uglify())
		.pipe(concat("app.js"))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest("public/dist/js"))
		.pipe(liveReload());
});
/* Images */
// gulp.task("images", function() {
// 	return gulp.src(IMAGES_PATH)
// 		.pipe(imageMin(
// 			[
// 				imageMin.gifsickle(),
// 				imageMin.jpegtran(),
// 				imageMin.optipng(),
// 				imageMin.svgo(),
// 				pngQuaint(),
// 				jpegRecompress()
// 			]
// 		))
// });
/* Delete public dist folder */
gulp.task("clear", function() {
	return del.sync([DIST_PATH]);
})
/* Default */
gulp.task("default", ["clear", "scrpits", "styles"], function() {
	console.log("starting default task");
});
/* Gulp export task */
gulp.task("export", function() {
	return gulp.src("public/**/*")
		.pipe(zip("website.zip"))
		.pipe(gulp.dest())
})
/* gulp watch */
gulp.task("watch", function() {
	console.log("Starting watch task");
	require("./server");
	liveReload.listen();
	gulp.watch(SCRIPTS_PATH, ["scripts"]);
	gulp.watch(STYLES_PATH, ["styles"]);
	//gulp.watch(SASS_PATH, ["styles_sass"]);
});