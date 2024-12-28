import HumanCard2 from "@/components/card/human2";
import { Pressable, ScrollView, View } from "react-native";
import { router } from "expo-router";
import { DATE_DATA } from "@/constant";
import { useAuth } from "@/provider/AuthProvider";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import Spinner from "react-native-loading-spinner-overlay";
import { Text } from "@/components/ui/text";

const db = DATE_DATA;

export default function MatchesScreen1() {
  const { session } = useAuth();
  const [data, setData] = useState<any[] | undefined>(undefined);

  useEffect(() => {
    (async () => {
      const [
        { data: likes, error: errorLikes },
        { data: profiles, error: errorProfile },
      ] = await Promise.all([
        supabase.from("likes").select("*"),
        supabase.from("profiles").select("*"),
      ]);

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
              ? `${like.user_id}-${like.target_user_id}`
              : `${like.target_user_id}-${like.user_id}`;
          uniquePairs.add(key);
        }
      });

      const mergedProfiles = Array.from(uniquePairs)
        .map((pair: string) => {
          const [user_id, target_user_id] = pair.split("-");
          const profile = profiles.find(
            (p) => p.user_id === user_id || p.user_id === target_user_id
          );
          return profile;
        })
        .filter(Boolean); // Filter out null values

      setData(mergedProfiles);
    })();
  });

  return (
    <ScrollView className="flex-1 h-full bg-white dark:bg-black">
      {/* Kiểm tra nếu không có dữ liệu */}
      {!data || data.length === 0 ? (
        <View className="flex-1 justify-center items-center p-4">
          <Text className="text-gray-500 dark:text-gray-400 font-bold">Không có ai</Text>
        </View>
      ) : (
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
      )}
    </ScrollView>
  );
}
