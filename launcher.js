const fs = require('fs')
const workPath = `${process.cwd()}/user`
const entrypoint = `${workPath}/{{ENTRYPOINT}}`

// Setup some environment variables
process.env.NODE_ENV = 'production'
process.env.NOW_DEPLOYMENT = 'true'
process.chdir(workPath)

// Start the main function and await for it's
const entryPointInfo = require(entrypoint)

module.exports.launcher = async function(event) {
  // Parse the event in order to obtain all the required informations, supports both forms used by now
  if (event.Action === 'Invoke') event = JSON.parse(event.body)

  // Get all parameters
  const { httpMethod, path, headers, encoding } = event

  // Normalize method and body since they can come from two event types
  let { method, body } = event
  if (!method) method = httpMethod
  if (encoding === 'base64') body = Buffer.from(body, encoding)

  // Forward the request to localhost
  try {
    const url = `http://127.0.0.1:${entryPointInfo.port}${path}`
    console.log(`forwarding to ${url}`)
    const response = await got(url, { method, headers, body, throwHttpErrors: false })

    // Adjust some response parameters
    delete response.headers.connection
    delete response.headers['content-length']
    if (typeof response.body === 'object') response.body = JSON.stringify(response.body)

    // Return the response of the event
    return {
      statusCode: response.statusCode,
      headers: response.headers,
      body: Buffer.from(response.body).toString('base64'),
      encoding: 'base64'
    }
  } catch (e) {
    throw e
  }
}
