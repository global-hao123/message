'use strict';

module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jsdoc : {
      dist : {
        src: ['src/*.js'],
        options: {
          destination: 'doc'
        }
      }
    }
  });

  grunt.registerTask('default', []);
  grunt.registerTask("doc", ["jsdoc"]);
}
