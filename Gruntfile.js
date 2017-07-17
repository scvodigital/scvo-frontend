module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        exec: {
            get_fonts: {
                cmd: 'grep -roh "\\(fa-[a-z][a-z0-9-]\\+\\)" ./ --include=*.html --include=*.ts --include=*.json | sort -u | node fonts/generate-config.js',
                maxBuffer: 204800
            },
            firebase_deploy_hosting: 'firebase deploy --only "hosting"',
            ng_build: 'ng build -prod -e prod -pr false -aot false',
            ng_build_dev: 'ng build -pr false -aot false',
        },
        fontello: {
            dist: {
                options: {
                    config: 'fonts/fontello-config.json',
                    fonts: 'src/app/assets/icons/font',
                    styles: 'src/app/assets/icons/css',
                    scss: true,
                    force: true,
                    exclude: ['animation.scss', 'fontello.scss', 'fontello-ie7.scss', 'fontello-ie7-codes.css', 'fontello-codes.scss'],
                }
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-fontello');

    // Default task(s).
    grunt.registerTask('build-icons', ['exec:get_fonts', 'fontello']);
    grunt.registerTask('firebase-deploy', ['build-icons', 'exec:ng_build', 'exec:firebase_deploy_hosting']);
};
