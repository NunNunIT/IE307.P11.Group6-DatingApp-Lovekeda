// const { getDefaultConfig } = require("expo/metro-config");
// const { withNativeWind } = require("nativewind/metro");

// const config = getDefaultConfig(__dirname);

// module.exports = withNativeWind(config, { input: "./global.css" });

const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

// Lấy cấu hình mặc định
const defaultConfig = getDefaultConfig(__dirname);

// Kết hợp cấu hình NativeWind
const configWithNativeWind = withNativeWind(defaultConfig, { input: "./global.css" });

// Bổ sung thêm phần mở rộng cho `resolver`
configWithNativeWind.resolver.sourceExts.push('cjs');

module.exports = configWithNativeWind;
