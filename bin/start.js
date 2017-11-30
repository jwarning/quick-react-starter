const spawn = require('cross-spawn')
const path = require('path')

module.exports = () => {
  spawn(
    'webpack-dev-server',
    [
      '--config',
      path.resolve(__dirname, '../webpack.config.js'),
      ...process.argv.slice(3)
    ],
    {
      stdio: 'inherit'
    }
  )
}
