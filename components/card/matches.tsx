import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { DATE_DATA } from "@/constant";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { router } from "expo-router";
import { useAuth } from "@/provider/AuthProvider";
import { supabase } from "@/utils/supabase";

export default function Matches() {
  const { session } = useAuth();
  const [data, setData] = useState<any[] | undefined>(undefined);

  useEffect(() => {
    (async () => {
      const [
        { data: likes, error: errorLikes },
        { data: profiles, error: errorProfile }
      ] = await Promise.all([
        supabase
          .from('likes')
          .select("*"),
        supabase
          .from('profiles')
          .select("*")
      ])

      if (errorLikes || errorProfile) {
        return;
      }

      // Filter and merge profiles based on symmetric `user_id` and `target_user_id`
      const uniquePairs = new Set<string>();

      likes.forEach(like => {
        if (
          like?.user_id === session?.user.id ||
          like?.target_user_id === session?.user.id
        ) {
          const key =
            like?.user_id && like?.target_user_id && like.user_id < like.target_user_id
              ? `${like.user_id}---${like.target_user_id}`
              : `${like.target_user_id}--${like.user_id}`;
          uniquePairs.add(key);
        }
      });

      // console.log("🚀 ~ uniquePairs:", uniquePairs)

      const mergedProfiles = [
        // ...DATE_DATA,
        ...Array.from(uniquePairs)
          .map((pair: string) => {
            const [user_id, target_user_id] = pair.split("---");
            const profile = profiles.find(
              p => p.user_id === target_user_id && target_user_id !== session?.user.id
            );
            return profile;
          })
          .filter(Boolean) // Filter out null values
      ]
        .reduce((acc: Record<string, any>, item) => {
          if (item && item.user_id && !acc[item.user_id]) {
            acc[item.user_id] = {
              name: item.name,
              imgs: item.imgs,
              user_id: item.user_id,
            };
          }
          return acc;
        }, {})

      setData(Object.values(mergedProfiles));

    })()
  }, []);

  return (
    <View className="">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {data?.map((matches, index) => {
          return (
            <TouchableOpacity
              key={index}
              className="flex items-center max-w-24 px-3"
              onPress={() => router.push(`/chatDetail/${matches.id}`)}
            >
              <Image
                source={{ uri: matches.imgs[0] }}
                resizeMode="cover"
                className="rounded-full w-full aspect-square size-16"
              />
              <Text
                className="mt-2 text-zinc-800 dark:text-zinc-200 font-medium text-base text-nowrap line-clamp-1"
                style={{
                  fontSize: hp(1.6),
                }}
              >
                {Array.isArray(matches.name) ? matches.name?.split(' ').slice(-1) : matches.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
