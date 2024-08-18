/* eslint-disable no-undef */
const { getDefaultConfig } = require('@expo/metro-config'); // Correct module path

const defaultConfig = getDefaultConfig(__dirname);
defaultConfig.resolver.sourceExts.push('cjs');

module.exports = defaultConfig;
