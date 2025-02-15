import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { ReactNode } from "react";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { router } from "expo-router";
import { useAuth } from "@/providers/AuthProvider";
import { customizeFetch } from "@/lib/functions";
import useSWR from "swr";

export default function Matches() {
  const { profile } = useAuth();
  const { data } = useSWR<TProfile[]>(
    `/users/${profile?.user_id}/matches`,
    customizeFetch
  );

  return (
    <View className="pt-4">
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {data?.map((match, index) => renderItem(index, match))}
      </ScrollView>
    </View>
  );
}

function renderItem(index: number, match: TProfile): ReactNode {
  return (
    <TouchableOpacity
      key={index}
      className="flex items-center max-w-24 px-3"
      onPress={moveToChatDetail(match)}
    >
      <Image
        source={{ uri: match.imgs[0] }}
        resizeMode="cover"
        className="rounded-full w-full aspect-square size-16"
      />
      <Text
        className="mt-2 text-zinc-800 dark:text-zinc-200 font-medium text-base text-nowrap line-clamp-1"
        style={{ fontSize: hp(1.6) }}
      >
        {Array.isArray(match.name)
          ? match.name?.split(" ").slice(-1)
          : match.name}
      </Text>
    </TouchableOpacity>
  );
}

function moveToChatDetail(match: TProfile) {
  return () =>
    router.push({
      pathname: "/chat-detail/[id]",
      params: { id: match.user_id },
    });
}
