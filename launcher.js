const { Bridge } = require('./bridge.js')
const { Server } = require('http')
const bridge = new Bridge()

const saveListen = Server.prototype.listen
Server.prototype.listen = function(...args) {
  this.on('listening', function() {
    bridge.port = this.address().port
  })
  saveListen.apply(this, args)
}

try {
  const fs = require('fs')
  console.log(process.cwd())
  console.log(fs.readdirSync(process.cwd()))

  process.env.NODE_ENV = 'production'
  process.chdir(`${process.cwd()}/user`)
  require('/** ENTRYPOINT **/')
} catch (error) {
  console.error(error)
  bridge.userError = error
}

exports.launcher = bridge.launcher
