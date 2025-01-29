const { getDefaultConfig } = require("@expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

// Get the default configuration from Expo
const defaultConfig = getDefaultConfig(__dirname);

// Integrate NativeWind with additional configuration
const configWithNativeWind = withNativeWind(defaultConfig, { input: "./global.css" });

// Add custom resolver extensions if necessary
configWithNativeWind.resolver.sourceExts.push("cjs");
module.exports = configWithNativeWind;
