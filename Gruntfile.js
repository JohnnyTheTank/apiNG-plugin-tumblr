module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            js: {
                files : {
                    'dist/aping-plugin-tumblr.min.js' : [
                        'src/aping-tumblr-directive.js',
                        'src/aping-tumblr-helper.js',
                        'bower_components/angular-tumblr-api-factory/src/angular-tumblr-api-factory.js'
                    ]
                }
            },
            options: {
                banner: '\n/*! <%= pkg.name %> v<%= pkg.version %> (<%= grunt.template.today("dd-mm-yyyy") %>) by <%= pkg.author %> */\n',
            }
        },
        watch: {
            minifiyJs: {
                files: [
                    'src/aping-tumblr-directive.js',
                    'src/aping-tumblr-helper.js',
                    'bower_components/angular-tumblr-api-factory/src/angular-tumblr-api-factory.js'
                ],
                tasks: ['uglify'],
                options: {
                    spawn: true,
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['watch']);

};

