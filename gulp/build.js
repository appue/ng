var fs   = require('fs'),
	argv = require('yargs').argv,
	os   = require('os'),
	dir  = require('./tools/build.project.js')(),
	buildFolder = '../wireless/';

var runType  = argv.run || '',
	isDebug  = argv.debug || false,
	isApp	 = argv.app || false,
	codePath = './source/',
	cssPath  = codePath +'themes',
	d        = new Date(),
	version  = d.getTime(),
	veros    = os.platform();

if (isApp) {
    buildFolder = '../zip/wireless/';
}

switch (runType) {
	case 'build':
	case 'build-net':
		netPort = argv.port || 9999;
		netPath = buildFolder;
	break;

	default:
		netPort = argv.port || 9090;
		netPath = codePath;
}

module.exports = function (gulp, $) {
	gulp.task('sass', function () {
		return gulp.src(cssPath +'*.scss')
			.pipe($.plumber())
			.pipe($.sass())
			.pipe($.size({title: 'css'}))
			.pipe(gulp.dest(cssPath));		
	});

	gulp.task('clean', function () {
		if (runType !== 'build') return;

		return gulp.src([
				// buildFolder,
				'./.tmp'
			],{read: false})
			.pipe($.rimraf({force: true}));	
	});	

	gulp.task('connect', function () {
		if (runType == 'build') return;

		var url = '';

		if (runType == 'build-net') {
			$.connect.server({
				root: netPath,
				port: netPort,
				livereload: false
			});
		} else {
			$.connect.server({
				root: netPath,
				port: netPort,
				livereload: true
			});
		}
			
		switch (veros) {
			case 'win32':
				url = 'start http://127.0.0.1:' + netPort;
			break;
			
			case 'darwin':
				url = 'open http://127.0.0.1:' + netPort;
			break;
		}

		gulp.src('')
			.pipe($.shell(url));
	});	

	gulp.task('watch', function () {
		$.livereload.listen();
	
		$.watch(codePath +'themes/**/*.scss', function () {
			return gulp.src(codePath +'themes/*.scss')
				.pipe($.plumber())
				.pipe($.sass())
				.pipe($.size({title: 'css'}))
				.pipe(gulp.dest(cssPath))
				.pipe($.livereload());
		});
	
		$.watch([
				codePath +'**/*.js',
				codePath +'**/*.html',
				codePath +'**/*.css'
			])
			.pipe($.livereload());
	});

	gulp.task('replacehtml', function () {
		var files = [
				'library.js?v='+ version,
				'common.js?v='+ version,
				'index.js?v='+ version
			];

        if (isApp) {
            return gulp.src([
                    codePath +'index.html'
                ])
                .pipe($.htmlReplace({
                    'css': 'themes/all.css?v='+ version,
                    'js': files
                }))
                .pipe($.replace(/\<base href=\"\/\" \>/g, ''))
                .pipe(gulp.dest(buildFolder));
        } else {
    		return gulp.src([
    				codePath +'index.html'
    			])
    			.pipe($.htmlReplace({
    				'css': 'themes/all.css?v='+ version,
    				'js': files
    			}))
    			.pipe($.replace(/\<base href=\"\/\" \>/g, '<base href="/wireless/" >'))
    			// .pipe($.htmlmin({collapseWhitespace: true}))
    			.pipe(gulp.dest(buildFolder));
        }
	});

	gulp.task('templates', function () {
		return gulp.src([
				codePath +'**/*.html',
				'!'+ codePath +'index.html',
                '!'+ codePath +'public/**/*',
                '!'+ codePath +'plugins/**/*'
			])
			.pipe($.ngHtml2js({
				moduleName: 'ajmd',
				prefix: ''
			}))
			.pipe(gulp.dest('./.tmp/'));
	});

	gulp.task('movecss', ['sass'], function () {
		return gulp.src([
				codePath +'**/*.css',
                '!'+ codePath +'public/**/*',
                '!'+ codePath +'plugins/**/*'
			])	
			.pipe($.minifyCss())
			.pipe(gulp.dest(buildFolder));
	});

	gulp.task('movefonts', function() {
        return gulp.src([
                codePath +'themes/fonts/*'
            ])
            .pipe(gulp.dest(buildFolder +'/themes/fonts'));
	});

	gulp.task('moveimages', function() {
        return gulp.src([
                codePath +'**/*.jpg',
                codePath +'**/*.png',
                '!'+ codePath +'themes/temp/*',
                '!'+ codePath +'public/**/*',
                '!'+ codePath +'plugins/**/*'
            ])
            .pipe(gulp.dest(buildFolder));
	});

	gulp.task('movejs', function() {
        gulp.src([
            codePath +'public/**/*'
        ])
        .pipe(gulp.dest(buildFolder +'/public'));
        
        gulp.src([
            codePath +'plugins/**/*'
        ])
        .pipe(gulp.dest(buildFolder +'/plugins'));
        
        gulp.src([
            codePath +'cordova.js',
            codePath +'cordova_android.js',
            codePath +'cordova_plugins.js'
        ])
        .pipe(gulp.dest(buildFolder));
	});

	gulp.task('minjs', function() {
        var framejs = [
				codePath +'library/frame/*.js',
				codePath +'library/extend/*.js'
            ];

        if (isApp && isDebug) {
			gulp.src(framejs)
				.pipe($.concat('library.js'))
				.pipe($.replace(/isDebugCreate=true/g, 'isDebugCreate=true'))
				.pipe($.replace(/isHybridCreate=false/g, 'isHybridCreate=true'))
				.pipe($.uglify())
				.pipe(gulp.dest(buildFolder));
        } else {
        	if (isApp) {
				gulp.src(framejs)
					.pipe($.concat('library.js'))
					.pipe($.replace(/isDebugCreate=true/g, 'isDebugCreate=false'))
					.pipe($.replace(/isHybridCreate=false/g, 'isHybridCreate=true'))
					.pipe($.uglify())
					.pipe(gulp.dest(buildFolder));
			} else if (isDebug) {
				gulp.src(framejs)
					.pipe($.concat('library.js'))
					// .pipe($.replace(/isDebugCreate=true/g, 'isDebugCreate=true'))
					// .pipe($.replace(/isHybridCreate=false/g, 'isHybridCreate=false'))
					.pipe($.uglify())
					.pipe(gulp.dest(buildFolder));
			} else {
				gulp.src(framejs)
					.pipe($.concat('library.js'))
					.pipe($.replace(/isDebugCreate=true/g, 'isDebugCreate=false'))
					// .pipe($.replace(/isHybridCreate=false/g, 'isHybridCreate=false'))
					.pipe($.uglify())
					.pipe(gulp.dest(buildFolder));
			}
        }

        gulp.src([
                codePath +'app.js',
                './.tmp/common/**/*.js',
                codePath +'common/**/*.js'
            ])
            .pipe($.concat('common.js'))
            .pipe($.ngAnnotate())
            .pipe($.uglify())
            .pipe(gulp.dest(buildFolder));

        gulp.src([
                './.tmp/**/*.js',
                codePath +'**/*.js',
                '!./.tmp/common/**/*.js',
                '!'+ codePath +'app.js',
                '!'+ codePath +'library/**/*.js',
                '!'+ codePath +'common/**/*.js',
                '!'+ codePath +'public/**/*',
                '!'+ codePath +'plugins/**/*',
                '!'+ codePath +'cordova.js',
                '!'+ codePath +'cordova_android.js',
                '!'+ codePath +'cordova_plugins.js'
            ])
            .pipe($.concat('index.js'))
            .pipe($.ngAnnotate())
            .pipe($.uglify())
            .pipe(gulp.dest(buildFolder));
	});
	
	gulp.task('inject', function () {
		return gulp.src(codePath + 'index.html')
			.pipe(
				$.inject(
					gulp.src(codePath +'library/frame/*.js', {read: false}), {
						relative: true,
						name: 'injectframe'
					}
				)
			)
			.pipe(
				$.inject(
					gulp.src(codePath +'library/extend/*.js', {read: false}), {
						relative: true,
						name: 'injectextend'
					}
				)
			)
			.pipe(
				$.inject(
					gulp.src(codePath +'common/**/*.js', {read: false}), {
						relative: true,
						name: 'injectcommon'
					}
				)
			)
			.pipe(
				$.inject(
					gulp.src([
							codePath +'**/*.js',
							'!'+ codePath +'*.js',
							'!'+ codePath +'common/**/*.js',
							'!'+ codePath +'themes/*',
							'!'+ codePath +'library/**/*',
							'!'+ codePath +'public/**/*',
                			'!'+ codePath +'plugins/**/*'
						],
						{read: false}
					),
					{relative: true}
				)
			)
			.pipe(gulp.dest(codePath));
	});

	gulp.task('jshint', function () {
		var files = [
				codePath +'**/*.js',
				'!'+ codePath +'library/**/*',
				'!'+ codePath +'common/directives/delegate_event.js',
                '!'+ codePath +'public/**/*',
                '!'+ codePath +'plugins/**/*'
			];

		if (argv.files) files = argv.files.split(',');
			
		return gulp.src(files)
			.pipe($.jshint())
			.pipe($.jshint.reporter('default'));
	});

	gulp.task('zip', function () {
		return gulp.src('../zip/**')
			.pipe($.zip('web.zip'))
			.pipe(gulp.dest('../zip/'));
	});
};