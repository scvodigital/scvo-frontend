module.exports = function(grunt) {
    var functions = grunt.option('functions');
    if (functions) {
        functions = functions.split(',').map(func => 'functions:' + func).join(',');
    } else {
        functions = 'functions';
    }

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            main: {
                src: ['./dist']
            },
            appengine: {
                src: ['./appengine/dist']
            }
        },
        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/',
                        src: ['**/*'],
                        dest: 'dist/'
                    }
                ]
            },
            appengine: {
                files: [
                    {
                        nonull: true,
                        expand: true,
                        cwd: './dist/assets/',
                        src: ['**/*'],
                        dest: './appengine/dist/assets/'
                    }
                ]
            }
        },
        sass: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: './dist/assets/css',
                        src: ['*.scss'],
                        dest: 'dist/assets/css',
                        ext: '.css'
                    }
                ]
            }
        },
        bgShell: {
            serveOld: {
                cmd: 'devmode=true firebase serve -p 9000 --only hosting,functions'
            },
            serve: {
                execOpts: {
                    cwd: './appengine'
                },
                cmd: 'devmode=true npm start'
            },
            deploy: {
                cmd: 'firebase deploy --only hosting,' + functions
            },
            deployHosting: {
                cmd: 'firebase deploy --only hosting'
            },
            deployFunctions: {
                cmd: 'firebase deploy --only ' + functions
            },
            deployDb: {
                execOpts: {
                    cwd: './functions'
                },
                cmd: 'firebase database:set -y /sites/ ./appengine/test-db/db.json'
            },
            buildFunctions: {
                execOpts: {
                    cwd: './functions'
                },
                cmd: 'tsc'
            },
            json2: {
                execOpts: {
                  cwd: './appengine'
                },
                cmd: 'node json2 ./test-db/json2/**/*.json2 ./test-db/json; node json2 ./test-db/db.json2 ./test-db'
            },
            upgradeRouter: {
                cmd: 'yarn add -E scvo-router; cd functions; yarn add -E scvo-router; cd ..'
            },
            testRouter: {
                cmd: 'cd ../scvo-router; npm run build; npm link; cd ../scvo-frontend; npm link scvo-router; cd functions; npm link scvo-router; cd ..'
            },
            gzip: {
                execOpts: {
                    cwd: './dist'
                },
                cmd: 'find . -type f | while read -r x; do gzip -c "$x" > "$x.gz"; done'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-bg-shell');

    grunt.registerTask('default', ['clean:main', 'clean:appengine', 'copy:main', 'sass', 'copy:appengine', 'bgShell:json2', 'bgShell:gzip', 'bgShell:buildFunctions']);
    grunt.registerTask('serve', ['default', 'bgShell:serve']);
    grunt.registerTask('serve-old', ['default', 'bgShell:serveOld']);
    grunt.registerTask('serve-router', ['default', 'bgShell:testRouter', 'serve']);
    grunt.registerTask('deploy-all', ['default', 'bgShell:deploy', 'bgShell:deployDb']);
    grunt.registerTask('deploy-db', ['default', 'bgShell:deployDb']);
    grunt.registerTask('deploy-hosting', ['default', 'bgShell:deployHosting']);
    grunt.registerTask('deploy-functions', ['default', 'bgShell:deployFunctions']);
    grunt.registerTask('upgrade-router', ['bgShell:upgradeRouter']);
};
