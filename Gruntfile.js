module.exports = function (grunt) {

  require('jit-grunt')(grunt, {
    browserSync: 'grunt-browser-sync'
  });
  require('time-grunt')(grunt);

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    path: {
      src: './src',
      env: './dev'
    },

    clean: {
      all: ['<%= path.env %>']
    },

    eslint: {
      target: ['./Gruntfile.js']
    },

    assemble: {
      options: {
        layoutdir: '<%= path.src %>/layouts',
        partials: ['<%= path.src %>/partials/*.hbs'],
        plugins: [
          'assemble-unused-partials'
        ],
        helpers: [
          'handlebars-helper-repeat',
          'handlebars-helper-prettify'
        ],
        prettify: {
          unformatted: ['br']
        }
      },
      all: {
        options: {
          layout: 'default.hbs'
        },
        files: [
          {
            expand: true,
            cwd: '<%= path.src %>/pages',
            src: '**/*.hbs',
            dest: '<%= path.env %>'
          }
        ]
      }
    },

    browserify: {
      dist: {
        options: {
          transform: [
            ['babelify']
          ]
        },
        files: [
          {
            expand: true,
            cwd: '<%= path.src %>/js',
            src: ['*.js'],
            dest: '<%= path.env %>/js'
          }
        ]
      }
    },

    watch: {
      options: {
        spawn: false
      },
      html: {
        files: ['<%= path.src %>/**/*.hbs'],
        tasks: ['assemble']
      },
      js: {
        files: ['<%= path.src %>/js/**/*.js'],
        tasks: ['browserify']
      }
    },

    browserSync: {
      all: {
        options: {
          watchTask: true,
          server: {
            baseDir: '<%= path.env %>'
          },
          open: false
        },
        bsFiles: {
          src: [
            '<%= path.env %>/**/*.html',
            '<%= path.env %>/js/**/*.js'
          ]
        }
      }
    }
  });


  grunt.registerTask('default', ['clean', 'eslint']);
  grunt.registerTask('serve', ['clean', 'assemble', 'browserify', 'browserSync', 'watch']);
};
