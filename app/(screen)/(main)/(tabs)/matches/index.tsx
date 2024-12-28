import HumanCard2 from "@/components/card/human2";
import { Pressable, ScrollView, View } from "react-native";
import { router } from "expo-router";
import { DATE_DATA } from "@/constant";
import { useAuth } from "@/provider/AuthProvider";

const db = DATE_DATA;

export default function MatchesScreen1() {
  const { session } = useAuth();

  // Filter out the current user
  const filteredData = db.filter((item) => item.id !== session?.user?.id);

  return (
    <ScrollView className="flex-1 h-full bg-white dark:bg-black">
      <View className="flex flex-row flex-wrap gap-2 justify-between p-2 pb-20">
        {filteredData.map((item) => (
          <Pressable
            key={item.id} // Use `id` for unique keys
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
