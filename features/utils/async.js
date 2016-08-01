'use strict'

module.exports = {
  serial, promisify
}

/**
 * Take an iterable of Promises and invoke them serially, otherwise identical
 * to the `Promise.all` static method.
 *
 * @param {Promise[]} promises
 * @return {Promise}
 */
function serial (promises) {
  const results = []

  return promises
  .reduce((chain, promise) =>
    chain.then(result => {
      results.push(result)
      return promise
    }), Promise.resolve())
  .then(result => {
    results.push(result)
    results.shift()
    return results
  })
}


function promisify (fn) {
  return arg => new Promise((resolve, reject) =>
    fn(arg, (error, result) => error ? reject(error) : resolve(result))
  )
}
