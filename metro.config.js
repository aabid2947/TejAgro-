// const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

// /**
//  * Metro configuration
//  * https://reactnative.dev/docs/metro
//  *
//  * @type {import('metro-config').MetroConfig}
//  */
// const config = {};

// module.exports = mergeConfig(getDefaultConfig(__dirname), config);
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const config = {
  transformer: {
    // Keep your existing context support
    unstable_allowRequireContext: true,
  },
  resolver: {
    // The "Lazy" fix: Force Metro to look at 'browser' before 'main' 
    // This stops Axios from trying to load the Node-only crypto module.
    resolverMainFields: ['react-native', 'browser', 'module', 'main'],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);