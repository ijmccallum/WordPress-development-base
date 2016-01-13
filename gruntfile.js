module.exports = function(grunt) {

	var skeletorFileRoot = 'www/wp-content/themes/theme-name/',
		skeletorUrlRoot = '/wp-content/themes/theme-name/';

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		watch: {
			css: {
				files: [skeletorFileRoot + 'development/scss/**/*.scss'],
				tasks: ['sass']
			},
			sprites: {
				files: [skeletorFileRoot + 'development/svg_icons/*'],
				tasks: ['grunticon']
			},
			hologram: {
				files: [
					skeletorFileRoot + 'css/main.css',
					skeletorFileRoot + 'development/styleguide/Cortana/'
				],
				tasks: ['hologram']
			}
		},

		sass: {
			dist: {
				options: {
					style: 'compressed',
					loadPath: require('node-bourbon').includePaths,
					require: ['sass-css-importer', 'sass-globbing', 'susy']
				},
				files: {
					'www/wp-content/themes/theme-name/css/main.css': 'www/wp-content/themes/theme-name/development/scss/main.scss',
					'www/wp-content/themes/theme-name/css/oldie.css': 'www/wp-content/themes/theme-name/development/scss/oldie.scss',
					'www/wp-content/themes/theme-name/css/editor.css': 'www/wp-content/themes/theme-name/development/scss/editor.scss',
					'www/wp-content/themes/theme-name/css/login.css': 'www/wp-content/themes/theme-name/development/scss/login.scss'
				}
			}
		},

		grunticon: {
			myIcons: {
				files: [{
					expand: true,
					cwd: skeletorFileRoot + 'development/svg_icons',
					src: ['*.svg', '*.png'],
					dest: skeletorFileRoot + 'assets/icons'
				}],
				options: {
					enhanceSVG: true,
					cssprefix: '.icon-'
				}
			}
		},

		requirejs: {
			compile: {
				options: {
					baseUrl: skeletorFileRoot + 'development/js',
					dir: skeletorFileRoot + 'js',
					removeCombined: true,
					//optimize: 'none',
					paths: {
						//Map all CDN paths to empty so optimizer doesn't try to include them
						jquery: "empty:",
					},
					modules: [
						// First set up the common build layer.
						{
							// module names are relative to baseUrl
							name: 'skeletor.main'
						},
						// Now set up a build layer for each main layer, but exclude
						// the common one. If you're excluding a module, the excludee
						// must appear before the excluder in this file. Otherwise it will
						// get confused.
						{
							name: 'components/mobile',
							exclude: ['skeletor.main']
						},
						{
							name: 'components/slider',
							exclude: ['skeletor.main']
						}
					]
				}
			}
		},

		replace: {
			build: {
				src: ['index.html'],
				overwrite: true,
				replacements: [{
					from: skeletorFileRoot + "/development/js/",
					to: skeletorFileRoot + "/js/"
				}]
			},
			dev: {
				src: ['index.html'],
				overwrite: true,
				replacements: [{
					from: skeletorFileRoot + "/js/",
					to: skeletorFileRoot + "/development/js/"
				}]
			}
		},

		browserSync: {
			dev: {
				bsFiles: {
					src : [
						skeletorFileRoot + 'css/**/*.css',
						skeletorFileRoot + 'development/js/**/*.js',
						'www/index.php'
					]
				},
				options: {
					proxy: "http://ventures.local:8080/",
					watchTask: true
					//server: "./www"

				}
			}
		},

		hologram: {
			generate: {
				options: {
					config: 'hologram_config.yml'
				}
			}
		}

	});

	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	grunt.registerTask('dev', ['grunticon','replace:dev','browserSync', 'watch']);
	grunt.registerTask('build', ['requirejs','replace:build']);

	grunt.registerTask('default', 'dev');
}