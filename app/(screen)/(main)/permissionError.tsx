import DarkModeSwitch from "@/components/darkModeOption/switch";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useLocation } from "@/provider/LocationProvider";
import { Redirect } from "expo-router";
import React, { useEffect } from "react";
import { View } from "react-native";
import * as Location from "expo-location";


export default function SettingsScreen() {
  const { permissionStatus, checking } = useLocation();
  if (permissionStatus !== "denied") {
    return <Redirect href="/(screen)/(main)/(tabs)" />;
  }

  const onClick = async () => {
    await Location.requestForegroundPermissionsAsync();
    await checking();
  }

  return (
    <View className="w-full h-full flex justify-center items-center gap-4 p-4">
      <View className="flex flex-row gap-4 items-center">
        <Text>Chế độ tối</Text>
        <DarkModeSwitch />
      </View>
      <Text>Ứng dụng cần bạn cung cấp vị trí</Text>
      <Button onPress={onClick}><Text>Yêu cầu cung cấp vị trí</Text></Button>
    </View>
  );
}
