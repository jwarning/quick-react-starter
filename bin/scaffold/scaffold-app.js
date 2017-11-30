const fs = require('fs')
const { kebabCase, startCase } = require('lodash')
const path = require('path')
const promptly = require('promptly')

const examplePackageJson = require('./package-json-template')

function nameValidator(value) {
  if (value.length < 3) {
    throw new Error('Error: App name too short.\n')
  }

  return value
}

function scaffoldApp() {
  console.log('------------------------------------------------------------')
  console.log('Initialising a new QRS App.')
  console.log('------------------------------------------------------------\n')

  promptly.prompt(
    'Please enter a name for the app: ',
    { validator: nameValidator },
    (err, value) => {
      const fileName = 'package.json'
      const baseDir = process.cwd()

      try {
        if (fs.existsSync(path.join(baseDir, fileName))) {
          console.log('Error: An npm project already exists here.\n')
          return
        }

        console.log('\nA new app will be created.\n')

        // write the package json
        fs.writeFileSync(
          path.join(baseDir, fileName),
          examplePackageJson(value),
          'utf8',
          error => {
            if (error) {
              console.log(error)
            }
          }
        )

        // write the gitignore
        fs.writeFileSync(
          path.join(baseDir, '.gitignore'),
          '.DS_Store\n*.log\nnode_modules\ndist\n.idea\n.vscode\n'
        )

        // make the new src directory
        fs.mkdirSync(path.join(baseDir, 'src'), error => {
          if (error) {
            console.log(error)
          }
        })

        // write the index.js
        fs.writeFileSync(
          path.join(baseDir, 'src/index.js'),
          fs.readFileSync(path.join(__dirname, './index-template.js'))
        )

        // write the index.html
        fs.writeFileSync(
          path.join(baseDir, 'src/index.html'),
          fs.readFileSync(path.join(__dirname, './index-template.html'))
        )

        // make the new src/components directory
        fs.mkdirSync(path.join(baseDir, 'src/components'), error => {
          if (error) {
            console.log(error)
          }
        })

        console.log('App successfully created.\n')
        console.log(
          '------------------------------------------------------------'
        )
      } catch (e) {
        console.log(e)
      }
    }
  )
}

module.exports = scaffoldApp
