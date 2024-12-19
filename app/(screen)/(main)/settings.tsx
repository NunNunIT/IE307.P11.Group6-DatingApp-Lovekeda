import DarkModeSwitch from "@/components/darkModeOption/switch";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useColorScheme } from "nativewind";
import { View } from "react-native";
import { useAuth } from "~/provider/AuthProvider";

export default function SettingsScreen() {
  const { signOut } = useAuth();
  const { toggleColorScheme } = useColorScheme();

  return (
    <View className="w-full flex flex-col gap-4 p-4">
      <Button variant="secondary" className="flex flex-row justify-between shadow p-6 py-2" onPress={toggleColorScheme}>
        <Text className="text-lg">Chế độ tối</Text>
        <DarkModeSwitch />
      </Button>
      <Button onPress={signOut} className="w-full" variant="destructive">
        <Text>Đăng xuất</Text>
      </Button>
    </View>
  );
}
