module.exports = function (grunt) {

  require('jit-grunt')(grunt);
  require('time-grunt')(grunt);

  grunt.initConfig({
    path: {
      src: './src',
      env: './dev'
    },

    clean: {
      all: ['<%= path.env %>']
    }
  });

  grunt.registerTask('default', ['clean']);
};
