#!/usr/bin/env node

const chalk = require('chalk')
const program = require('commander')
const spawn = require('cross-spawn')

const buildScript = require('./build')
const formatScript = require('./format')
const startScript = require('./start')
const testScript = require('./test')

const scaffoldApp = require('./scaffold/scaffold-app')
const scaffoldComponent = require('./scaffold/scaffold-component')

const packageJSON = require('../package.json')

program
  .allowUnknownOption()
  .version(`Version ${packageJSON.version}`)
  .usage('qrs [options]')
  .option('build', 'build the app', buildScript)
  .option('component', 'scaffold a new component', scaffoldComponent)
  .option('init', 'initialise a new app', scaffoldApp)
  .option('format', 'run the formatter and linter', formatScript)
  .option('start', 'start the dev server', startScript)
  .option('test', 'run the tests', testScript)

program.on('--help', () => {
  console.log('\n  Examples:\n')
  console.log('    $ qrs --help')
  console.log('    $ qrs build\n')
})

if (!process.argv.slice(2).length) {
  console.log('------------------------------------------------------------')
  console.log('Welcome to the QRS CLI.')
  console.log('------------------------------------------------------------')
  program.help()
}

program.parse(process.argv)
