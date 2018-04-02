'use strict';

const validateBoolOption = (name, value, defaultValue) => {
  if (typeof value === 'undefined') {
    value = defaultValue;
  }

  if (typeof value !== 'boolean') {
    throw new Error('Preset cookups: `' + name + '` option must be a boolean.');
  }

  return value;
};


module.exports = function(api, options) {
  if (!options) {
    options = {};
  }

  var isFlowEnabled = validateBoolOption('flow', options.flow, true);
  var isReactNative = validateBoolOption('react-native', options.reactNative, true);
  var isReactNativeWeb = validateBoolOption('react-native-web', options.reactNativeWeb, true);
  var isNode = validateBoolOption('node', options.node, true);


  return {
    presets: [
      isReactNative && [require('babel-preset-react-native')],
      isNode && [require('babel-preset-env'), {
        targets: {
          node: 'current'
        }
      }],
      isFlowEnabled && [require('babel-preset-flow').default]
    ].filter(Boolean),
    plugins: [
      require('babel-plugin-syntax-dynamic-import').default,
      require('babel-plugin-transform-decorators-legacy').default,
      isReactNativeWeb && require('babel-plugin-react-native-web')
    ].filter(Boolean)
  };
};
