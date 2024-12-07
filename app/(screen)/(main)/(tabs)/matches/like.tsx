// 21522436 - Nguyễn Thị Hồng Nhung
import Matches from "@/components/card/matches";
import HumanCard2 from "@/components/card/human2"; // Đảm bảo import đúng nơi
import { ScrollView, View } from "react-native";
import { Text } from "~/components/ui/text";
import { GridView } from "react-native-ui-lib";

const db = [
  {
    name: "Richard Hendricks",
    imgs: [
      "https://phanmemmkt.vn/wp-content/uploads/2024/09/avt-Facebook-cho-am-dep.jpg",
      "https://img.hoidap247.com/picture/question/20210904/large_1630765811060.jpg",
      "https://placehold.co/400",
      "https://img.hoidap247.com/picture/question/20210904/large_1630765811060.jpg",
    ],
    age: "18",
    city: "HCM",
    country: "VN",
  },
  {
    name: "Erlich Bachman",
    imgs: [
      "https://placehold.co/400",
      "https://placehold.co/400",
      "https://placehold.co/400",
      "https://placehold.co/400",
    ],
    age: "18",
    city: "HCM",
    country: "VN",
  },
  {
    name: "Monica Hall",
    imgs: [
      "https://placehold.co/400",
      "https://placehold.co/400",
      "https://placehold.co/400",
      "https://placehold.co/400",
    ],
    age: "18",
    city: "HCM",
    country: "VN",
  },
  {
    name: "Jared Dunn",
    imgs: [
      "https://placehold.co/400",
      "https://placehold.co/400",
      "https://placehold.co/400",
      "https://placehold.co/400",
    ],
    age: "18",
    city: "HCM",
    country: "VN",
  },
  {
    name: "Dinesh Chugtai",
    imgs: [
      "https://placehold.co/400",
      "https://placehold.co/400",
      "https://placehold.co/400",
      "https://placehold.co/400",
    ],
    age: "18",
    city: "HCM",
    country: "VN",
  },
];

export default function LikeScreen() {
  return (
    <ScrollView className="flex-1 h-full bg-white dark:bg-black">
      {/* Render list of people */}
      <View className="flex flex-row flex-wrap gap-2 justify-between p-4 pb-20">
        {db.map((item, index) => (
          <View className="w-[48%] aspect-[3/4] overflow-hidden rounded-lg">
            <HumanCard2 key={index} item={item} />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
