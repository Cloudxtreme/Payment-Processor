var spawn = require('child_process').spawn;
var _ = require('lodash');
var optionsBuilder = require('./optionsBuilder.js');

module.exports = function (grunt) {
  grunt.registerMultiTask('rust', 'Building rust project', function () {
    var done = this.async();
    var cargoProgram = this.target;
    
   var options = optionsBuilder(cargoProgram, this.data);

    var cargo = spawn(
      'cargo', options 
    );

    if (this.options().verbose) {
      cargo.stdout.on('data', function (data) {
        grunt.log.write(data.toString()); 
      });

      cargo.stderr.on('data', function (data) {
        grunt.log.write(data.toString());
      });
    }

    cargo.on('close', function () {
      grunt.log.writeln('Cargo finished');
      done();
    });

  });
}

