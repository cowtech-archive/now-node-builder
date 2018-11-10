const { createLambda } = require('@now/build-utils/lambda.js')
const download = require('@now/build-utils/fs/download.js')
const FileBlob = require('@now/build-utils/file-blob.js')
const FileFsRef = require('@now/build-utils/file-fs-ref.js')
const fs = require('fs')
const glob = require('@now/build-utils/fs/glob.js')
const path = require('path')
const { promisify } = require('util')
const { runNpmInstall, runPackageJsonScript } = require('@now/build-utils/fs/run-user-scripts.js')
const readFile = promisify(fs.readFile)

exports.build = async ({ files, entrypoint, workPath }) => {
  // Install NPM
  console.log('Installing dependencies ...')
  await runNpmInstall(path.join(workPath, path.dirname(entrypoint)))

  let launcherData = await readFile(path.join(__dirname, 'launcher.js'), 'utf8')
  launcherData = launcherData.replace(
    '// PLACEHOLDER',
    ['process.chdir("./user");', `require("./${path.join('user', entrypoint)}");`].join(' ')
  )

  const launcherFiles = {
    'launcher.js': new FileBlob({ data: launcherData }),
    'bridge.js': new FileFsRef({ fsPath: require('@now/node-bridge') })
  }

  const lambda = await createLambda({
    files: { ...files, ...launcherFiles },
    handler: 'launcher.launcher',
    runtime: 'nodejs8.10'
  })

  return { [entrypoint]: lambda }
}

exports.prepareCache = async ({ files, entrypoint, cachePath }) => {
  return {
    ...(await glob('user/node_modules/**', cachePath)),
    ...(await glob('user/package-lock.json', cachePath)),
    ...(await glob('user/yarn.lock', cachePath))
  }
}
