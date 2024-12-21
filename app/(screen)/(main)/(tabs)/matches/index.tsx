// 21522436 - Nguyễn Thị Hồng Nhung
import HumanCard2 from "@/components/card/human2"; // Đảm bảo import đúng nơi
import { Pressable, ScrollView, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { DATE_DATA } from "@/constant";

const db = DATE_DATA;

export default function MatchesScreen1() {
  const { id } = useLocalSearchParams();
  return (
    <ScrollView className="flex-1 h-full bg-white dark:bg-black">
      <View className="flex flex-row flex-wrap gap-2 justify-between p-2 pb-20">
        {db.map((item, index) => (
          <Pressable
            key={index}
            onPress={() => router.push(`/chatDetail/${item.id}`)}
            className="w-[48%] aspect-[3/4] overflow-hidden rounded-lg"
          >
            <HumanCard2 item={item} handleClick={undefined} />
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}
