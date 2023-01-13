module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    concat: {
      options: {
        banner: "/*! <%= pkg.name %> v<%= pkg.version %> | <%= pkg.homepage %> | <%= pkg.license %> */\n\n", 
        footer: "\n/*! Author: <%= pkg.author.name %> <<%= pkg.author.email %>> | Updated: <%= grunt.template.today('dS mmm yyyy') %> */"},
      js: {
        src: ["src/init.js", "src/token.js", "src/credentials.js", "src/image.js", "src/mail.js", ],
        dest: "nem.js"}
    }
  });
  
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.registerTask("default", ["concat"]);
};