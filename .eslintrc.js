const fs = require('fs')
const path = require('path')

let overrideConfig = () => {}
const overridePath = path.resolve(process.cwd(), 'qrs.config.js')

if (fs.existsSync(overridePath)) {
  try {
    const data = require(overridePath)
    overrideConfig =
      typeof data.eslintrc === 'function' ? data.eslintrc : overrideConfig
  } catch (e) {
    console.log('Error: ', e.stack)
  }
}

const config = {
  extends: ['airbnb', 'plugin:flowtype/recommended', 'prettier'],
  env: {
    browser: true,
    node: true
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 8,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: ['react', 'flowtype'],
  rules: {
    'comma-dangle': ['error', 'never'],
    'class-methods-use-this': 'off',
    'global-require': 'off',
    'import/no-extraneous-dependencies': 'off',
    'no-confusing-arrow': 'off',
    'no-mixed-operators': 'off',
    'jsx-a11y/alt-text': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/label-has-for': 'off',
    'jsx-a11y/no-noninteractive-element-interactions': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'prefer-destructuring': 'off',
    'prefer-promise-reject-errors': 'off',
    'quote-props': ['error', 'consistent-as-needed'],
    'react/no-array-index-key': 'off',
    'react/jsx-closing-bracket-location': ['error', 'after-props'],
    'react/jsx-filename-extension': 'off',
    'react/jsx-indent': ['error', 2],
    'react/jsx-indent-props': ['error', 2],
    'react/jsx-boolean-value': 'off',
    'react/no-danger': 'off',
    'react/no-unescaped-entities': 'off',
    'react/prefer-stateless-function': 'off',
    'react/prop-types': 'off',
    'react/require-default-props': 'off',
    'react/no-multi-comp': 'off',
    'react/sort-comp': 'off',
    semi: ['error', 'never']
  }
}

module.exports = Object.assign(
  {},
  config,
  overrideConfig(Object.assign({}, config))
)
