const fs = require('fs')
const http = require('http')

const workPath = `${process.cwd()}/user`
const entrypoint = `${workPath}/{{ENTRYPOINT}}`

// Setup some environment variables
process.env.NODE_ENV = 'production'
process.chdir(workPath)

// Start the main function and await for it's
const entryPointInfo = require(entrypoint)

async function forward(port, method, path, headers, body) {
  console.log(`forwarding to http://127.0.0.1:${entryPointInfo.port}${path}`)
  const opts = { hostname: '127.0.0.1', port, method, path, headers }

  return new Promise(function(resolve, reject) {
    const req = http.request(opts, response => {
      const chunks = []

      // Append response chunks
      response.on('data', chunk => chunks.push(Buffer.from(chunk)))

      // Handle errors
      response.on('error', reject)
      response.on('end', () => {
        // Adjust some response parameters
        delete response.headers.connection
        delete response.headers['content-length']

        // Return the respnse
        resolve({
          statusCode: response.statusCode,
          headers: response.headers,
          body: Buffer.concat(chunks).toString('base64'),
          encoding: 'base64'
        })
      })
    })

    if (body) req.write(body)
    req.end()
  })
}

module.exports.launcher = async function(event) {
  // Parse the event in order to obtain all the required informations, supports both forms used by now
  if (event.Action === 'Invoke') event = JSON.parse(event.body)

  // Get all parameters
  const { httpMethod, path, headers, encoding } = event

  // Normalize method and body since they can come from two event types
  let { method, body } = event
  if (!method) method = httpMethod
  if (encoding === 'base64') body = Buffer.from(body, encoding)

  // Forward the request to the server
  try {
    return await forward(entryPointInfo.port, method, path, headers, body)
  } catch (e) {
    throw e
  }
}
