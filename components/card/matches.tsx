import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import React, { useCallback, useState } from "react";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { router, useFocusEffect } from "expo-router";
import { useAuth } from "@/provider/AuthProvider";
import { customizeFetch } from "@/lib/functions";

export default function Matches() {
  const { profile } = useAuth();
  const [data, setData] = useState<TProfile[] | undefined>(undefined);

  useFocusEffect(
    useCallback(() => {
      if (!profile) return;
      (async () => {
        const data = await customizeFetch(`/users/${profile.user_id}/matches`);
        setData(data);
      })();
    }, [profile])
  );

  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {data?.map((matches, index) => renderItem(index, matches))}
      </ScrollView>
    </View>
  );
}

function renderItem(index: number, matches: TProfile): React.JSX.Element {
  return (
    <TouchableOpacity
      key={index}
      className="flex items-center max-w-24 px-3"
      onPress={moveToChatDetail(matches)}
    >
      <Image
        source={{ uri: matches.imgs[0] }}
        resizeMode="cover"
        className="rounded-full w-full aspect-square size-16"
      />
      <Text
        className="mt-2 text-zinc-800 dark:text-zinc-200 font-medium text-base text-nowrap line-clamp-1"
        style={{ fontSize: hp(1.6) }}
      >
        {Array.isArray(matches.name)
          ? matches.name?.split(" ").slice(-1)
          : matches.name}
      </Text>
    </TouchableOpacity>
  );
}

function moveToChatDetail(matches: TProfile) {
  return () =>
    router.push({
      pathname: "/chat-detail/:id",
      params: { id: matches.user_id },
    });
}
