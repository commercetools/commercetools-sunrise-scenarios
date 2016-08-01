'use strict'

const crypto = require('crypto')

module.exports = {
  unique
};

function unique () {
  return `${Date.now()}-${crypto.randomBytes(4).toString('hex')}`
}

function range (count) {
  const num = parseInt(count, 10);
  return Array(num).fill(null);
}
