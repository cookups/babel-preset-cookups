'use strict';
// based on babel-preset-react-app and babel-preset-react-native

/**
 * Manually resolve all default Babel plugins.
 * `babel.transform` will attempt to resolve all base plugins relative to
 * the file it's compiling.
 */
function resolvePlugins(plugins) {
  return plugins.map(function(plugin) {
    // Normalise plugin to an array.
    if (!Array.isArray(plugin)) {
      plugin = [plugin];
    }
    // Only resolve the plugin if it's a string reference.
    if (typeof plugin[0] === 'string') {
      plugin[0] = require('babel-plugin-' + plugin[0]);
      plugin[0] = plugin[0].__esModule ? plugin[0].default : plugin[0];
    }
    return plugin;
  });
}

// validate options
const validateBoolOption = (name, value, defaultValue) => {
  if (typeof value === 'undefined') {
    value = defaultValue;
  }

  if (typeof value !== 'boolean') {
    throw new Error('Preset cookups: `' + name + '` option must be a boolean.');
  }

  return value;
};

// validate env
const validateEnv = (env, dev, prod, test) => {
  if (!dev && !prod && !test) {
    throw new Error(
      'Using `babel-preset-cookups` requires that you specify `NODE_ENV` or ' +
        '`BABEL_ENV` environment variables. Valid values are "development", ' +
        '"test", and "production". Instead, received: ' +
        JSON.stringify(env) +
        '.'
    );
  }
};

module.exports = function(api, options) {
  if (!options) {
    options = {};
  }
  // env
  const env = process.env.BABEL_ENV || process.env.NODE_ENV;
  const isEnvDevelopment = env === 'development';
  const isEnvProduction = env === 'production';
  const isEnvTest = env === 'test';
  validateEnv(env, isEnvDevelopment, isEnvProduction, isEnvTest);

  // options
  const isFlowEnabled = validateBoolOption('flow', options.flow, true);
  const isReactNativeWeb = validateBoolOption(
    'reactNativeWeb',
    options.reactNativeWeb,
    false
  );

  return {
    plugins: resolvePlugins([
      'macros',
      isFlowEnabled && 'syntax-flow',
      'syntax-async-functions',
      'syntax-class-properties',
      'syntax-trailing-function-commas',
      // 'syntax-dynamic-import',
      [
        'transform-runtime',
        {
          helpers: false,
          polyfill: false,
          regenerator: true
        }
      ],
      // 'transform-dynamic-import',
      // 'dynamic-import-node',
      'transform-class-properties',
      'transform-es2015-function-name',
      'transform-es2015-arrow-functions',
      'transform-es2015-block-scoping',
      'transform-es2015-classes',
      'transform-es2015-object-super',
      'transform-es2015-computed-properties',
      'check-es2015-constants',
      'transform-es2015-destructuring',
      [
        'transform-es2015-modules-commonjs',
        { strict: false, allowTopLevelThis: true }
      ],
      'transform-es2015-parameters',
      'transform-es2015-shorthand-properties',
      'transform-es2015-spread',
      'transform-es2015-template-literals',
      'transform-es2015-literals',
      isFlowEnabled && 'transform-flow-strip-types',
      'transform-object-assign',
      ['transform-object-rest-spread', { useBuiltIns: true }],
      'transform-react-display-name',
      ['transform-react-jsx', { useBuiltIns: true }],
      'transform-regenerator',
      'transform-exponentiation-operator',
      'transform-es2015-unicode-regex',
      'transform-es2015-sticky-regex',
      'transform-es2015-typeof-symbol',
      'transform-es2015-duplicate-keys',
      'transform-es2015-block-scoped-functions',
      'transform-decorators-legacy',
      'transform-async-to-generator',
      isReactNativeWeb && 'react-native-web',
      ['transform-es2015-for-of', { loose: true }],
      "syntax-dynamic-import"
    ].filter(Boolean)),
    env: {
      development: {
        plugins: resolvePlugins([
          'transform-react-jsx-self',
          'transform-react-jsx-source'
        ])
      },
      production: {
        plugins: resolvePlugins([
          // Remove PropTypes from production build
          [
            'transform-react-remove-prop-types',
            {
              removeImport: true
            }
          ],
          'transform-react-constant-elements',
          'transform-react-inline-elements'
        ])
      },
      test: {
        plugins: ['jest-hoist']
      }
    }
  };
};
