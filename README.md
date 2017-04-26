# api-promise

[![Build Status](https://travis-ci.org/vigour-io/api-promise.svg?branch=master)](https://travis-ci.org/vigour-io/api-promise)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![npm version](https://badge.fury.io/js/api-promise.svg)](https://badge.fury.io/js/api-promise)
[![Coverage Status](https://coveralls.io/repos/github/vigour-io/api-promise/badge.svg?branch=master)](https://coveralls.io/github/vigour-io/api-promise?branch=master)

Helper for fast API consuming in promises.

## Installing

```bash
npm install api-promise --save
```

## Usage

```js
const ap = require('api-promise')
const github = ap('api.github.com', 'GITHUB-TOKEN')

github('POST', '/some/api/path', { param: 'value' })
  .then(res => {
    // do something with the response
  })
  .catch(err => {
    // do something with the error
  })
```
