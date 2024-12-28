// 21522436 - Nguyễn Thị Hồng Nhung
import Matches from "@/components/card/matches";
import HumanCard2 from "@/components/card/human2"; // Đảm bảo import đúng nơi
import { ScrollView, View } from "react-native";
import { Text } from "~/components/ui/text";
import { GridView } from "react-native-ui-lib";
import { LIKE_DATA } from "@/constant";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import { useAuth } from "@/provider/AuthProvider";

// const db = LIKE_DATA

export default function LikeScreen() {
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

      const mergedProfiles = [...new Set(
        likes
          .filter(like => like.target_user_id === session?.user.id)
          .map(like => like.user_id)
      )].map(like_user_id => {
        const profile = profiles.find(p => p.user_id === like_user_id);
        return profile;
      })

      setData(mergedProfiles);
    })()
  });

  return (
    <ScrollView className="flex-1 h-full bg-white dark:bg-black">
      {/* Render list of people */}
      <View className="flex flex-row flex-wrap gap-2 justify-between p-4 pb-20">
        {data?.map((item, index) => (
          <View key={index} className="w-[48%] aspect-[3/4] overflow-hidden rounded-lg">
            <HumanCard2 item={item} handleClick={undefined} />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
