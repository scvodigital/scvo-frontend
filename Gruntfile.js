module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            main: {
                src: ['./dist']
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
            serve: {
                cmd: 'devmode=true firebase serve -p 9000 --only functions,hosting'
            },
            deploy: {
                cmd: 'firebase deploy --only functions,hosting'
            },
            deployHosting: {
                cmd: 'firebase deploy --only hosting'
            },
            deployFunctions: {
                cmd: 'firebase deploy --only functions'
            },
            deployDb: {
                execOpts: {
                    cwd: './functions'
                },
                cmd: 'firebase database:set -y / ./test-db/db.json'
            },
            buildFunctions: {
                execOpts: {
                    cwd: './functions'
                },
                cmd: 'tsc'
            },
            json2: {
                execOpts: {
                  cwd: './functions'
                },
                cmd: 'node json2 ./test-db/json2/**/*.json2 ./test-db/json; node json2 ./test-db/db.json2 ./test-db'
            },
            upgradeRouter: {
                cmd: 'yarn add -E scvo-router; cd functions; yarn add -E scvo-router; cd ..'
            },
            testRouter: {
                cmd: 'cd ../scvo-router; npm run build; npm link; cd ../scvo-frontend; npm link scvo-router; cd functions; npm link scvo-router; cd ..'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-bg-shell');

    grunt.registerTask('default', ['clean:main', 'copy:main', 'sass', 'bgShell:json2', 'bgShell:buildFunctions']);
    grunt.registerTask('serve', ['default', 'bgShell:serve']);
    grunt.registerTask('serve-router', ['default', 'bgShell:testRouter', 'serve']);
    grunt.registerTask('deploy-all', ['default', 'bgShell:deploy', 'bgShell:deployDb']);
    grunt.registerTask('deploy-db', ['default', 'bgShell:deployDb']);
    grunt.registerTask('deploy-hosting', ['default', 'bgShell:deployHosting']);
    grunt.registerTask('deploy-functions', ['default', 'bgShell:deployFunctions']);
    grunt.registerTask('upgrade-router', ['bgShell:upgradeRouter']);
};
