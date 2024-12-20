// 21522436 - Nguyễn Thị Hồng Nhung
import Matches from "@/components/card/matches";
import HumanCard2 from "@/components/card/human2"; // Đảm bảo import đúng nơi
import { ScrollView, View } from "react-native";
import { Text } from "~/components/ui/text";
import { GridView } from "react-native-ui-lib";
import { likeData } from "@/constant";

const db = likeData

export default function LikeScreen() {
  return (
    <ScrollView className="flex-1 h-full bg-white dark:bg-black">
      {/* Render list of people */}
      <View className="flex flex-row flex-wrap gap-2 justify-between p-4 pb-20">
        {db.map((item, index) => (
          <View key={index} className="w-[48%] aspect-[3/4] overflow-hidden rounded-lg">
            <HumanCard2 item={item} handleClick={undefined} />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
