import HumanCard2 from "@/components/card/human2";
import { Pressable, ScrollView, View } from "react-native";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import Spinner from "react-native-loading-spinner-overlay";
import { customizeFetch } from "@/lib/functions";
import { useAuth } from "@/provider/AuthProvider";
import { Text } from "@/components/ui/text";

export default function MatchesScreen() {
  const { profile } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<TProfile[] | undefined>(undefined);

  useEffect(() => {
    if (!profile) return;
    (async () => {
      try {
        setIsLoading(true);
        const data = await customizeFetch(`/users/${profile.user_id}/matches`);
        setData(data);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <ScrollView className="flex-1 h-full bg-white dark:bg-black">
      <View className="flex flex-row flex-wrap gap-2 justify-between p-2 pb-20">
        {renderContent(isLoading, data)}
      </View>
    </ScrollView>
  );
}

function renderContent(isLoading: boolean, data: TProfile[] | undefined) {
  if (isLoading) return <Spinner visible />;
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
      pathname: "/chat-detail/:id",
      params: { id: item.user_id },
    });
}
