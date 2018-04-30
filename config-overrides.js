const rewireReactHotLoader = require('react-app-rewire-hot-loader')
const rewireEslint = require('react-app-rewire-eslint')

module.exports = function override(config, env) {
  config = rewireReactHotLoader(config, env)
  config = rewireEslint(config, env)
  return config
}
