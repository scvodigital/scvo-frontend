module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        exec: {
            get_fonts: {
                cmd: 'grep -roh "\\(fa-[a-z][a-z0-9-]\\+\\)" ./ --include=*.html --include=*.ts --include=*.json | sort -u | node fonts/generate-config.js',
                maxBuffer: 204800
            },
            firebase_set_rules: 'firebase deploy --only "database"',
            firebase_set_config: 'firebase database:set -y /config ./firebase/database/config.json',
            firebase_set_sites: 'firebase database:set -y /sites ./firebase/database/sites.json',
            firebase_set_translations: 'firebase database:set -y /translations ./firebase/database/translations.json',
            firebase_get_config: 'firebase database:get --pretty -o ./firebase/database/config.json /config',
            firebase_get_sites: 'firebase database:get --pretty -o ./firebase/database/sites.json /sites',
            firebase_get_translations: 'firebase database:get --pretty -o ./firebase/database/translations.json /translations',
            firebase_deploy_hosting: 'firebase deploy --only "hosting"',
            ng_build: 'ng build -prod -e prod -pr false -aot false',
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

    grunt.registerTask('firebase-deploy-database', ['exec:firebase_set_rules', 'exec:firebase_set_config', 'exec:firebase_set_sites', 'exec:firebase_set_translations']);
    grunt.registerTask('firebase-backup-database', ['exec:firebase_get_config', 'exec:firebase_get_sites', 'exec:firebase_get_translations']);

    grunt.registerTask('firebase-deploy', ['build-icons', 'exec:ng_build', 'exec:firebase_deploy_hosting']);
    grunt.registerTask('firebase-deploy-full', ['exec:firebase_deploy_database', 'exec:firebase_deploy']);
};
