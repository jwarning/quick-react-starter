const enzyme = require('enzyme')
const Adapter = require('enzyme-adapter-react-16')

require('babel-register')({
  presets: [
    [
      'env',
      {
        targets: {
          node: 'current'
        }
      }
    ],
    'react',
    'flow'
  ],
  plugins: ['transform-class-properties', 'transform-object-rest-spread']
})

require('ignore-styles')

enzyme.configure({ adapter: new Adapter() })
