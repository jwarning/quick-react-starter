const spawn = require('cross-spawn')
const path = require('path')

module.exports = () => {
  spawn(
    'cross-env',
    [
      'NODE_ENV=production',
      'webpack',
      '--config',
      path.resolve(__dirname, '../webpack.config.js'),
      ...process.argv.slice(3)
    ],
    { stdio: 'inherit' }
  )
}
