var fs = require('fs'),
	argv = require('yargs').argv,
	os = require('os');

var runType = argv.run || '', // dev、build
	packType = argv.g || 'web';

module.exports = function (gulp, $) {
	gulp.task('tmpl', ['minjs'], function () {
	});
	
	gulp.task('dev', ['sass', 'connect', 'watch']);

	gulp.task('build', ['replacehtml', 'templates', 'movecss', 'moveimages', 'movejs', 'movefonts', 'connect'], function () {
		gulp.start('tmpl');
	});

	gulp.task('run', ['clean'], function () {
		switch(runType) {
			case 'build':
			case 'build-net':
				gulp.start('build');
			break;
			
			default:
				gulp.start('dev');
		}
	});
};