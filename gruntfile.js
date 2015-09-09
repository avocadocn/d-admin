'use strict';
var lrPort = 35730;
module.exports = function(grunt) {
    // Project Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        assets: grunt.file.readJSON('server/config/assets.json'),
        watch: {
            js: {
                files: ['gruntfile.js', 'admin.js', 'server/**/*.js', 'public/js/**', 'test/**/*.js'],
                tasks: ['jshint'],
                options: {
                    livereload: lrPort
                }
            },
            html: {
                files: ['public/views/**'],
                options: {
                    livereload: lrPort
                }
            },
            css: {
                files: ['public/css/**'],
                tasks: ['csslint'],
                options: {
                    livereload: lrPort
                }
            }
        },
        // jshint: {
        //     all: {
        //         src: ['gruntfile.js', 'admin.js', 'server/**/*.js', 'public/js/**', 'test/**/*.js', '!test/coverage/**/*.js'],
        //         options: {
        //             jshintrc: true
        //         }
        //     }
        // },
        uglify: {
            options: {
                mangle: false
            },
            production: {
                files: '<%= assets.js %>'
            }
        },
        csslint: {
            options: {
                csslintrc: '.csslintrc'
            },
            all: {
                src: ['public/css/**/*.css']
            }
        },
        cssmin: {
            combine: {
                files: '<%= assets.css %>'
            }
        },
        nodemon: {
            dev: {
                script: 'admin.js',
                options: {
                    args: [],
                    ignore: ['public/**', 'node_modules/**'],
                    ext: 'js,jade',
                    //nodeArgs: ['--debug'],
                    delayTime: 1,
                    env: {
                        PORT: require('./server/config/config').port
                    },
                    cwd: __dirname
                }
            }
        },
        concurrent: {
            tasks: ['nodemon', 'watch'],
            options: {
                logConcurrentOutput: true
            }
        },
        mochaTest: {
            options: {
                reporter: 'spec',
                require: 'admin.js'
            },
            src: ['test/mocha/**/*.js']
        },
        env: {
            test: {
                NODE_ENV: 'test'
            }
        },
        karma: {
            unit: {
                configFile: 'test/karma/karma.conf.js'
            }
        }
    });

    //Load NPM tasks
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-env');

    //Making grunt default to force in order not to break the project.
    grunt.option('force', true);

    //Default task(s).
    if (process.env.NODE_ENV === 'production') {
        grunt.registerTask('default', ['jshint', 'csslint', 'cssmin', 'uglify', 'concurrent']);
    } else {
        grunt.registerTask('default', ['jshint', 'csslint', 'concurrent']);
    }

    //Test task.
    grunt.registerTask('test', ['env:test', 'mochaTest', 'karma:unit']);
};
