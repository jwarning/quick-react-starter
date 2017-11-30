function exampleComponent(name) {
  const componentName = name.replace(/ /g, '')

  return `import React, { Component } from 'react'

export default class ${componentName} extends Component {
  render() {
    return <div>Component content goes here</div>
  }
}
`
}

module.exports = exampleComponent
