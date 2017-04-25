'use strict'

const dns = require('dns')

const dnsCache = {}

module.exports = (host) => new Promise((resolve, reject) => {
  if (dnsCache[host]) {
    resolve(dnsCache[host])
  } else {
    dns.lookup(host, { hints: dns.ADDRCONFIG }, (err, address) => {
      if (err) {
        reject(err)
      } else {
        dnsCache[host] = address
        setTimeout(() => { delete dnsCache[host] }, 3e4)
        resolve(dnsCache[host])
      }
    })
  }
})
