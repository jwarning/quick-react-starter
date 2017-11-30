# Quick React Starter

This project aims to abstract away the common React build tooling that I often use on smaller React projects into a module that can be installed as a dependency to make setting things up easier.

This project requires an up to date installation of Node.js (>=8.0.0) and npm (>=5.0.0). Yarn (>=1.0.0) can optionally be used too.

Install it with:

```
npm install quick-react-starter
```

and add the following to your npm scripts:

```json
"scripts": {
  "build": "qrs format && qrs test && qrs build",
  "dev": "qrs start",
  "format": "qrs format",
  "start": "qrs start",
  "test": "qrs test"
}
```

and the following to your `.gitignore`:

```
.DS_Store
*.log
node_modules
dist
.idea
.vscode
```

This is an opinionated setup, and as such makes the whole process seem a bit magical. If you want to dive into the details of what it actually does under the hood, have a look at the `webpack.config.js` file, as this is the glue that ties it all together.

Some of the key packages included are:

- [**Babel**](https://babeljs.io/) for transpiling newer features of JS to a more compatible standard based on current browser support
- [**Webpack**](https://webpack.js.org/) for bundling and loading any JS, CSS/SCSS and assets into a usable application bundle as well as providing a development server
- [**ESLint**](http://eslint.org/) for linting the JS files
- [**Prettier**](https://github.com/prettier/prettier) for auto-formatting JS and CSS/SCSS files in combination with ESLint
- [**PostCSS**](http://postcss.org/) for processing CSS/SCSS and doing automatic vendor prefixing as well as providing future CSS features
- [**Stylelint**](https://github.com/stylelint/stylelint) for linting the CSS/SCSS files
- [**Flow**](https://flow.org/) A static type checker for JS (an optional, opt-in feature)
- [**Mocha**](https://mochajs.org/) A test framework that is used to run any tests defined
- [**Chai**](http://chaijs.com/) A BDD/TDD assertion library for tests
- [**React**](https://facebook.github.io/react/) A JS library for UI development
- [**Redux**](http://redux.js.org/) A way to manage JS application state for React
- [**React Web Component Injector**](https://github.com/jwarning/react-web-component-injector) A way to inject React components into custom HTML selectors on a page

## API

- `build`: Build a prod-ready bundle of the application that is transpiled, bundled and minified into a `.js` and `.css` file.

- `start`: Run a local development server with a debuggable version of the app.

- `test`: Run any tests defined in the app. These can either be in the `test` folder or anywhere in the `src` folder with the extension `.test.js`.

## Usage

The following basic folder structure is recommended:

- `assets`:

  This directory is served as a static folder through Webpack during development. (Using this is entirely optional.)

- `src`:

  This should hold your source app code, components and styles. The `src/styles` sub directory by default does not apply CSS module scoping, whereas any other scss files are loaded with local scope in React components.

- `test`:

  This directory holds your test code. Additionally any files defined under the `src` directory with the extension `.test.js` will also be executed when you run `npm test`.


### Example entry point

The following example JS file illustrates how one might set up a React app that injects two custom components and their relevant Redux reducers onto the page. This has to be called after the components have been defined on the page, otherwise they will not be injected correctly. One does not have to use this approach and can instead adopt a more traditional way of defining an app root entry point and then calling React DOM's render method to mount your React app.

```javascript
import { inject } from 'react-web-component-injector'
import { combineReducers, createStore, applyMiddleware, compose } from 'redux'
import { createLogger } from 'redux-logger'

import MyComponentReducer from './my-component/reducer'
import OtherComponentReducer from './other-component/reducer'

import MyComponent from './components/my-component/MyComponent'
import OtherComponent from './components/other-component/OtherComponent'

import './styles/index.scss'

const dev = process.env.NODE_ENV !== 'production'

const createStoreWithMiddleware = compose(
  dev ? applyMiddleware(createLogger()) : f => f
)(createStore)

const store = createStoreWithMiddleware(
  combineReducers({
    'my-component': MyComponentReducer,
    'other-component': OtherComponentReducer
  })
)

inject(
  {
    'My-Component': MyComponent,
    'Other-Component': OtherComponent
  },
  {
    store
  }
)
```

### Overriding the config

If you want to override the default webpack config, one can optionally add a file with the name `qrs.config.js` to the main folder and export overrides for the config:

```javascript
// module.exports.packageName is a shortcut to set both the JS and CSS output names
module.exports.packageName = 'myProject'

// module.exports.sourcePath is a way to change the path to the source directory (useful for a monorepo)
module.exports.sourcePath = path.resolve(__dirname, 'projects/myProject')

// module.exports.eslintrc can optionally override the standard eslint config.
// it needs to be a function that returns an object and this will be merged
// onto the default config. the first argument is the existing config
module.exports.eslintrc = function(config) {
  return Object.assign({}, config, {
    rules: Object.assign({}, config.rules, {
      'import/extensions': ['off']
    })
  })
}

// module.exports.webpack can optionally override the standard webpack config.
// it needs to be a function that returns an object and this will be merged
// onto the default config. the first argument is the existing config
module.exports.webpack = function(config) {
  if (process.env.NODE_ENV === 'production') {
    return Object.assign({}, config, {
      entry: config.entry.concat('anotherEntryPoint')
    })
  }
}
```

## CLI Usage

QRS comes with a command line interface which one can use for common build tasks as well as to scaffold out new apps or components. The following commands are currently included:

- `build`:

  This will run the build command for the app and produces a production ready webpack bundle for any JS, CSS and HTML.

- `format`:

  This run the formatter and linter setups and will modify any relevant files in place. Any outstanding issues will be shown in the output.

- `start`:

  This starts the development server and will run a dev-friendly build of the webpack bundles in order to make debugging a lot easier.

- `test`:

  This runs any tests defined for the app and outputs the results.

- `component`:

  This scaffolds out a new React component in the components directory of your app.

- `init`:

  This scaffolds out a new QRS app with a basic structure ready to go.
