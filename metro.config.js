const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

const path = require('path');

module.exports = withNativeWind(config, { input: path.join(__dirname, 'src/global.css') });
