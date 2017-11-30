function examplePackageJson(name) {
  return `{
  "name": "${name}",
  "version": "0.1.0",
  "description": "",
  "author": "",
  "copyright": "",
  "private": true,
  "main": "index.js",
  "scripts": {
    "build": "qrs format && qrs test && qrs build",
    "dev": "qrs start",
    "format": "qrs format",
    "start": "qrs start",
    "test": "qrs test"
  },
  "devDependencies": {
    "quick-react-starter": "1.0.0"
  }
}
`
}

module.exports = examplePackageJson
