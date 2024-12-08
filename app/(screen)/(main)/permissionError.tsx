import DarkModeSwitch from "@/components/darkModeOption/switch";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import React from "react";
import { View } from "react-native";

export default function SettingsScreen() {
  return (
    <View className="w-full h-full flex justify-center items-center gap-4 p-4">
      <Text>Ứng dụng cần bạn cung cấp vị trí</Text>
    </View>
  );
}
