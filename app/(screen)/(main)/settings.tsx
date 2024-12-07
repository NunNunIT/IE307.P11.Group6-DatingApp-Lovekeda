import DarkModeSwitch from "@/components/darkModeOption/switch";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import React from "react";
import { View } from "react-native";
import { useAuth } from "~/provider/AuthProvider";

export default function SettingsScreen() {
  const { signOut } = useAuth();

  return (
    <View className="w-full flex flex-col gap-4 p-4">
      <View className="relative flex flex-row justify-between rounded-lg bg-white dark:bg-zinc-900 shadow p-6">
        <Text className="text-lg">Chế độ tối</Text>
        <DarkModeSwitch />
      </View>
      <Button onPress={signOut} className="w-full" variant="destructive">
        <Text>Đăng xuất</Text>
      </Button>
    </View>
  );
}
