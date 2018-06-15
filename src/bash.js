const exec = require('child_process').exec;

class Basch {
  static execute (command) {
    return new Promise((fulfill, reject) => {
      exec(command, function(err, stdout, stderr) {
        if (err) {
          return reject(stderr);
        }
        return fulfill(stdout);
      });

      /*statement.on('exit', function (code) {
        fulfill(code);
      });*/

    });
  }
}

module.exports = Basch;