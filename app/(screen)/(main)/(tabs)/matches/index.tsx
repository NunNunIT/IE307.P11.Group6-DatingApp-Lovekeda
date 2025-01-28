import HumanCard2 from "@/components/card/human2";
import { Pressable, ScrollView, View } from "react-native";
import { router } from "expo-router";
import { customizeFetch } from "@/lib/functions";
import { useAuth } from "@/providers/AuthProvider";
import { Text } from "@/components/ui/text";
import useSWR from "swr";

export default function MatchesScreen() {
  const { profile } = useAuth();
  const { data } = useSWR<TProfile[]>(
    `/users/${profile?.user_id}/matches`,
    customizeFetch
  );

  return (
    <ScrollView className="flex-1 h-full bg-white dark:bg-black">
      <View className="flex flex-row flex-wrap gap-2 justify-between p-2 pb-20">
        {renderContent(data)}
      </View>
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

  return data.map((item) => (
    <Pressable
      key={item.user_id}
      onPress={moveToChatDetail(item)}
      className="w-[48%] aspect-[3/4] overflow-hidden rounded-lg"
    >
      <HumanCard2 item={item} handleClick={undefined} />
    </Pressable>
  ));
}

function moveToChatDetail(item: TProfile) {
  return () =>
    router.push({
      pathname: "/chat-detail/[id]",
      params: { id: item.user_id },
    });
}
