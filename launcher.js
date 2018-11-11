const fs = require('fs')
const workPath = `${process.cwd()}/user`
const entrypoint = `${workPath}/{{ENTRYPOINT}}`

process.env.NODE_ENV = 'production'
process.env.NOW_DEPLOYMENT = 'true'
process.chdir(workPath)
module.exports.launcher = require(entrypoint)
