'use strict'

const dns = require('dns')
const https = require('https')
const pkg = require('../package.json')

const dnsCache = {}

const lookup = (host, cb) => {
  if (dnsCache[host]) {
    cb(null, dnsCache[host])
  } else {
    dns.lookup(host, { hints: dns.ADDRCONFIG }, (err, address) => {
      if (err) {
        cb(err)
      } else {
        dnsCache[host] = address
        setTimeout(() => { delete dnsCache[host] }, 3e4)
        cb(null, dnsCache[host])
      }
    })
  }
}

module.exports = (hostname, token, headers, options) => {
  headers = Object.assign(
    { 'User-Agent': pkg.name },
    token ? { Authorization: `token ${token}` } : null,
    headers
  )
  return (method, path, body) => new Promise((resolve, reject) => {
    https.request(Object.assign({
      hostname,
      method,
      path,
      headers,
      lookup
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
  })
}
