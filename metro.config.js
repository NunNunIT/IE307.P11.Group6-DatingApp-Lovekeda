const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

// Get the default configuration from Expo
const defaultConfig = getDefaultConfig(__dirname);

// Integrate NativeWind with additional configuration
const configWithNativeWind = withNativeWind(defaultConfig, { input: "./global.css" });

// Add custom resolver extensions if necessary
configWithNativeWind.resolver.sourceExts.push("cjs");

module.exports = configWithNativeWind;

// const { getDefaultConfig } = require("expo/metro-config");
// const { withNativeWind } = require("nativewind/metro");

// // Lấy cấu hình mặc định
// const defaultConfig = getDefaultConfig(__dirname);

// // Kết hợp cấu hình NativeWind
// const configWithNativeWind = withNativeWind(defaultConfig, { input: "./global.css" });

// // Bổ sung thêm phần mở rộng cho `resolver`
// configWithNativeWind.resolver.sourceExts.push('cjs');

// module.exports = configWithNativeWind;
