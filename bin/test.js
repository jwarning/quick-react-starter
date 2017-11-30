const spawn = require('cross-spawn')
const path = require('path')

module.exports = () => {
  spawn(
    'mocha',
    [
      '--require',
      path.resolve(__dirname, '../test-require.js'),
      '--reporter',
      'spec',
      'test/**/*.js',
      'src/**/*.test.js',
      ...process.argv.slice(3)
    ],
    { stdio: 'inherit' }
  )
}
