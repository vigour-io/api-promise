'use strict'

const https = require('https')
const dnsResolve = require('./dns-resolve')
const pkg = require('../package.json')

module.exports = (host, token, headers, options) => (method, path, body) => dnsResolve(host)
  .then(apiIP => new Promise((resolve, reject) => {
    https.request(Object.assign({
      host,
      protocol: 'https:',
      method,
      path,
      headers: Object.assign({
        'User-Agent': ua || pkg.name,
        'Authorization': `token ${token}`
      }, headers)
    }, options))
      .on('response', res => {
        var data = ''

        res.on('error', reject)
        res.on('data', chunk => {
          data += chunk
        })
        res.on('end', () => {
          try {
            resolve(JSON.parse(data))
          } catch (e) {
            resolve(data)
          }
        })
      })
      .on('error', reject)
      .end(body && JSON.stringify(body))
  }))
