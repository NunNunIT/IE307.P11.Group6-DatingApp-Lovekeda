// 21522436 - Nguyễn Thị Hồng Nhung
import Matches from "@/components/card/matches";
import HumanCard2 from "@/components/card/human2"; // Đảm bảo import đúng nơi
import { Pressable, ScrollView, View } from "react-native";
// import { Text } from "~/components/ui/text";
// import { GridView } from "react-native-ui-lib";
import { router } from "expo-router";

const db = [
  {
    name: "Nguyễn Văn Hiếu",
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
    name: "Trần Văn Bình",
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
    name: "Lê Thị Hương",
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
    name: "Phạm Minh Tuấn",
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
    name: "Đặng Hoàng Long",
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
