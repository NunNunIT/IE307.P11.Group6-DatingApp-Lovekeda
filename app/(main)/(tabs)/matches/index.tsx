// 21522436 - Nguyễn Thị Hồng Nhung
import Matches from "@/components/card/matches";
import { View } from "react-native";

import { Text } from "~/components/ui/text";

export default function CategoriesScreen1() {
  return (
    <View className="flex h-fulljustify-start">
      <Matches />

      <Text>Categories Screen 1</Text>
    </View>
  );
}
