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
  var isReactNative = validateBoolOption('react-native', options.reactNative, false);
  var isReactNativeWeb = validateBoolOption('react-native-web', options.reactNativeWeb, false);
  var isNode = validateBoolOption('node', options.node, false);
  var isDefault = validateBoolOption('default', (!isReactNativeWeb && !isReactNativeWeb && !isNode), true)

  var presets = [
    isDefault && require('babel-preset-babel-preset-es2015'),
    isDefault && require('babel-preset-babel-preset-es2017'),
    isFlowEnabled && require('babel-preset-flow').default,
    isReactNative && require('babel-preset-react-native'),
    (isNode && (!isReactNative || !isReactNativeWeb))  && [require('babel-preset-env'), {
      targets: {
        node: 'current'
      }
    }],
  ];

  var plugins = [
    require('babel-plugin-syntax-dynamic-import').default,
    require('babel-plugin-transform-decorators-legacy').default,
    isReactNativeWeb && require('babel-plugin-react-native-web')
  ];


  return {
    presets: presets.filter(Boolean),
    plugins: plugins.filter(Boolean)
  };
};
