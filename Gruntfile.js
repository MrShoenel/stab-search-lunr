/* global console */
'use strict';
module.exports = function(grunt) {
	// Dynamically loads all required grunt tasks
	require('matchdep').filterDev('grunt-*')
		.forEach(grunt.loadNpmTasks);
	
	var buildPath = './build/stab.comments.github';
		
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		
		////////////////////////////////////////////////////////////////
		//
		// Now, this is the alphabetical list of grunt-tasks.
		// Note: The actual main-taks (default, watch etc.)
		//       are defined at the end of this file!
		//
		////////////////////////////////////////////////////////////////
		
		/**
		 * This task removes files or entire directories.
		 */
		clean: {
      all: ['./build/*'],
			nonUglified: ['./build/*', '!./build/stab.search.lunr.strategy.js']
		},
		
		concat: {
			header: {
				options: {
					banner: grunt.file.read('./resource/stab.search.lunr/strategy.header')
				},
				src: [!!grunt.option('skip-optimize') ?
					'./build/strategy.js' :
					'./build/stab.search.lunr.strategy.js'],
				dest: !!grunt.option('skip-optimize') ?
					'./build/strategy.js' :
					'./build/stab.search.lunr.strategy.js'
			},
			lunr2amd: {
				options: {
					banner: grunt.util.linefeed + ';(function(wnd) {' + grunt.util.linefeed,
					footer: grunt.util.linefeed + 'wnd[\'lunr\'] = lunr;})(window);' + grunt.util.linefeed
				},
				src: ['./build/lunr.js'],
				dest: './build/lunr.js'
			},
		},

		/**
		 * Tasks to copy-over specific files to specific directories.
		 * This is usually the case if we copy something from ./resoure
		 * over to ./build.
		 */
		copy: {
      js: {
				files: [{
					expand: true,
					cwd: './resource/stab.search.lunr/',
					src: ['*.js'],
					dest: 'build/'
				}]
			},
			
			lunr: {
				files: [{
					src: ['./resource/stab.search.lunr/library/*.js'],
					dest: './build/lunr.js'
				}]
			}
		},

		/**
		 * This tasks checks our good style during development :) It uses
		 * the parameters defined in tslint.json.
		 */
		tslint: {
			options: {
				configuration: grunt.file.readJSON('tslint.json')
			},

			app: {
				files: {
					src: ['./resource/**/*.ts']
				}
			}
		},
		
		/**
		 * All TypeScript compilation tasks
		 */
		typescript: {
			app: {
				src: ['./resource/**/*.ts'],
				options: {
					module: 'amd',
					target: 'ES5',
					sourceMap: true,
					declaration: false // won't create *.d.ts files
				}
			}
		},
		
		/**
		 * This task compresses and concatenates the output in-place.
		 */
		uglify: {
			all: {
				options: {
					mangle: false,
					mangleProperties: false
				},
				files: {
					'./build/stab.search.lunr.strategy.js': [
						'./build/lunr.js',
						'./build/strategy.js'
					]
				}
			}
		},

		////////////////////////////////////////////////////////////////
		//
		// Below this line only main tasks, alphabetically (the tasks
		// from above are usually not called directly).
		//
		////////////////////////////////////////////////////////////////
		
		/**
		* All watchable tasks. The specified tasks will be run if
		* the files specified change.
		*/
		watch: {
			typescript: {
				files: ['./resource/**/*.ts'],
				tasks: ['newer:tslint:app', 'newer:typescript:app', 'newer:copy:js']
			}
    }
	});
	
	grunt.registerTask('optimize', [
		'concat', 'uglify', 'clean:nonUglified'
	]);
  
  grunt.registerTask('default', (function(skipOptimize) {
		var tasks = [
			'clean', 'tslint', 'typescript', 'copy', 'concat:lunr2amd'
		];
		if (!skipOptimize) {
			tasks.push('optimize');
		}
		tasks.push('concat:header');
		return tasks;
	})(!!grunt.option('skip-optimize')));
  
  grunt.registerTask('watch-all', [
    'default',
    'watch'
  ]);
};
