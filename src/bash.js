const exec = require('child_process').exec;

class Bash {
  static execute (command) {
    return new Promise((fulfill, reject) => {
      exec(command, function(err, stdout, stderr) {
        if (err) {
          return reject(stderr);
        }
        return fulfill(stdout);
      });
    });
  }
}

module.exports = Bash;