const { Bridge } = require('./bridge.js')
const bridge = new Bridge()

try {
  const fs = require('fs')
  const workPath = `${process.cwd()}/user`
  const entrypoint = `${workPath}/{{ENTRYPOINT}}`

  process.env.NODE_ENV = 'production'
  process.chdir(workPath)
  require(entrypoint)
} catch (error) {
  console.error(error)
  bridge.userError = error
}

bridge.port = parseInt(process.env.PORT, 0)
exports.launcher = bridge.launcher
