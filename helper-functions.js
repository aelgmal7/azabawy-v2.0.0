const exec = require("child_process").exec

function executeCommand(command, callback) {
  exec(command, (error, stdout, stderr) => {
    callback(stdout)
    callback(error)
    callback(stderr)
  })
}

module.exports = { executeCommand }
