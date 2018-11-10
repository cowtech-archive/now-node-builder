const { Bridge } = require('./bridge.js')
const bridge = new Bridge()

try {
  const fs = require('fs')

  process.env.NODE_ENV = 'production'
  process.chdir(`${process.cwd()}/user`)
  console.log(fs.readdirSync(process.cwd()))
  require('./{{ENTRYPOINT}}')
} catch (error) {
  console.error(error)
  bridge.userError = error
}

bridge.port = parseInt(process.env.PORT, 0)
exports.launcher = bridge.launcher
