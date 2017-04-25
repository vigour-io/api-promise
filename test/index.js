'use strict'

const test = require('tape')
const ap = require('..')

test('github user', t => {
  const github = ap('api.github.com')
  github('GET', '/users/mstdokumaci')
    .then(resp => {
      t.equals(resp.login, 'mstdokumaci', 'correct username')
      return github('GET', '/users/mstdokumaci/followers')
    })
    .then(resp => {
      t.equals(resp.constructor, Array, 'correct response type')
      return github('GET', '/users/mstdokumaci/following')
    })
    .then(resp => {
      t.equals(resp.constructor, Array, 'correct response type')
      t.end()
    })
})
