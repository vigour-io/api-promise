'use strict'

const dns = require('dns')
const https = require('https')
const pkg = require('../package.json')

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

const dnsCache = {}

function lookup (host, options, cb) {
  if (!cb) {
    cb = options
    options = null
  }
  if (dnsCache[host] && dnsCache[host][2] > +new Date() - 6e4) {
    clearTimeout(dnsCache[host][3])
    dnsCache[host][3] = setTimeout(() => { delete dnsCache[host] }, 500)
    cb(null, dnsCache[host][0], dnsCache[host][1])
  } else {
    if (dnsCache[host]) {
      clearTimeout(dnsCache[host][3])
      delete dnsCache[host]
    }
    dns.lookup(host, options, (err, ip, type) => {
      if (err) {
        cb(err)
      } else {
        dnsCache[host] = [ip, type, +new Date()]
        dnsCache[host][3] = setTimeout(() => { delete dnsCache[host] }, 500)
        cb(null, dnsCache[host][0], dnsCache[host][1])
      }
    })
  }
}
