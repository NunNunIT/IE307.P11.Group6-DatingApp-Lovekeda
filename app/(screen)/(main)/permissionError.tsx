import DarkModeSwitch from "@/components/darkModeOption/switch";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useLocation } from "@/provider/LocationProvider";
import { Redirect } from "expo-router";
import React, { useEffect } from "react";
import { View } from "react-native";

export default function SettingsScreen() {
  const { location, permissionStatus } = useLocation();
  useEffect(() => {
    if (permissionStatus !== "denied") {
      return <Redirect href="/(screen)/(main)/(tabs)" />;
    }
    return
  }, [permissionStatus]);

  return (
    <View className="w-full h-full flex justify-center items-center gap-4 p-4">
      <Text>Ứng dụng cần bạn cung cấp vị trí</Text>
    </View>
  );
}
