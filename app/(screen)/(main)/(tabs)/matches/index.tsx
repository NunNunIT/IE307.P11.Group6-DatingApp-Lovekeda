// 21522436 - Nguyễn Thị Hồng Nhung
import Matches from "@/components/card/matches";
import HumanCard2 from "@/components/card/human2"; // Đảm bảo import đúng nơi
import { Pressable, ScrollView, View } from "react-native";
// import { Text } from "~/components/ui/text";
// import { GridView } from "react-native-ui-lib";
import { router } from "expo-router";
import { datesData } from "@/constant";

const db = datesData

export default function MatchesScreen1() {
  return (
    <ScrollView className="flex-1 h-full bg-white dark:bg-black">
      <View className="flex flex-row flex-wrap gap-2 justify-between p-2 pb-20">
        {db.map((item, index) => (
          <Pressable
            key={index}
            onPress={() => router.push("/chatDetail/1")}
            className="w-[48%] aspect-[3/4] overflow-hidden rounded-lg"
          >
            <HumanCard2 item={item} handleClick={undefined} />
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}
