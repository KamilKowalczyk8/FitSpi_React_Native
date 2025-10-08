// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Ta linia jest niezbędna dla Expo Router, aby mógł używać `require.context`
config.transformer.unstable_allowRequireContext = true;

module.exports = config;