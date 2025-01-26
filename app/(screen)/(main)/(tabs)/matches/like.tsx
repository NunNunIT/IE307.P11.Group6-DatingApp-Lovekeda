import HumanCard2 from "@/components/card/human2";
import { ScrollView, View } from "react-native";
import { Text } from "~/components/ui/text";
import { useCallback, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { customizeFetch } from "@/lib/functions";
import { useFocusEffect } from "expo-router";

export default function LikeScreen() {
  const { profile } = useAuth();
  const [data, setData] = useState<TProfile[] | undefined>(undefined);

  useFocusEffect(
    useCallback(() => {
      if (!profile) return;
      (async () => {
        const data = await customizeFetch(`/users/${profile.user_id}/likes`);
        setData(data);
      })();
    }, [])
  );

  return (
    <ScrollView className="flex-1 h-full bg-white dark:bg-black">
      {renderContent(data)}
    </ScrollView>
  );
}

function renderContent(data: TProfile[] | undefined) {
  if (!data?.length)
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-gray-500 dark:text-gray-400 font-bold">
          Không có ai
        </Text>
      </View>
    );

  return (
    <View className="flex flex-row flex-wrap gap-2 justify-between p-4 pb-20">
      {data.map((item, index) => (
        <View
          key={index}
          className="w-[48%] aspect-[3/4] overflow-hidden rounded-lg"
        >
          <HumanCard2 item={item} handleClick={undefined} />
        </View>
      ))}
    </View>
  );
}
