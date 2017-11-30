const spawn = require('cross-spawn')
const path = require('path')

module.exports = () => {
  const eslintConfig = path.resolve(__dirname, '../.eslintrc.js')

  const pe = spawn(
    'prettier-eslint',
    [
      '--write',
      '--jsx-bracket-same-line',
      '--no-semi',
      '--single-quote',
      '--eslint-config-path',
      eslintConfig,
      'src/**/*.js',
      'src/**/*.scss',
      ...process.argv.slice(3)
    ],
    {
      stdio: 'inherit'
    }
  ).on('close', peCode => {
    if (peCode === 0) {
      spawn(
        'eslint',
        ['--config', eslintConfig, 'src/**/*.js', ...process.argv.slice(3)],
        {
          stdio: 'inherit'
        }
      ).on('close', eCode => {
        if (eCode !== 0) {
          process.exit(1)
        }
      })
    } else {
      process.exit(1)
    }
  })
}
