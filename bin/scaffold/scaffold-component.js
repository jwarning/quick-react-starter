const fs = require('fs')
const { kebabCase, startCase } = require('lodash')
const path = require('path')
const promptly = require('promptly')

const exampleComponent = require('./component-template')

function nameValidator(value) {
  if (value.length < 3) {
    throw new Error('Error: Component name too short.\n')
  }

  return value
}

function scaffoldComponent() {
  console.log('------------------------------------------------------------')
  console.log('Initialising a new React component.')
  console.log('------------------------------------------------------------\n')
  console.log('Components should have a memorable name.')
  console.log("A good example would be something like 'ImageGalleryHeader'.\n")
  console.log(
    'Components will be created in the src/components directory\nand they need to be given unique names to identify them.'
  )
  console.log('------------------------------------------------------------\n')

  promptly.prompt(
    'Please enter a name for the new component: ',
    { validator: nameValidator },
    (err, value) => {
      const name = startCase(value)
      const componentName = name.replace(/ /g, '')
      const pathName = kebabCase(value)
      const baseDir = path.join(process.cwd(), 'src/components')

      try {
        fs.accessSync(path.join(baseDir, pathName), fs.F_OK)
        console.log('Error: A component with this name already exists.')
      } catch (e) {
        console.log(`\nA new component called '${name}' will be created.\n`)

        // make the new component directory
        fs.mkdirSync(path.join(baseDir, pathName), error => {
          if (error) {
            console.log(error)
          }
        })

        // write the react component
        fs.writeFileSync(
          path.join(baseDir, pathName, `${componentName}.js`),
          exampleComponent(name),
          'utf8',
          error => {
            if (error) {
              console.log(error)
            }
          }
        )

        console.log(
          `Component successfully created at src/components/${pathName}.\n`
        )
        console.log(
          '------------------------------------------------------------'
        )
      }

      return null
    }
  )
}

module.exports = scaffoldComponent
