import Carousel from "@/components/carousel/type1";
import { Text } from "@/components/ui/text";
import { supabase } from "@/utils/supabase";
import { useLocalSearchParams } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  Dimensions,
  Image,
  View,
  ActivityIndicator,
  ScrollView,
} from "react-native";

const { width } = Dimensions.get("window");

const ProfileDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true); // Trạng thái tải
  const [data, setData] = useState<any>(undefined);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", id);

      if (error) {
        console.log("error", error);
        return;
      }

      setData(data[0]);
      setIsLoading(false);
    })()
  }, []);

  return (
    <ScrollView className="relative flex-1 w-full h-full">
      {isLoading ? (
        <View className="w-full h-full justify-center items-center">
          <ActivityIndicator size="large" color="#fe183c" />
        </View>
      ) : (
        <View className="flex flex-col gap-3">
          <Carousel data={data?.imgs} containerStyle="h-fit aspect-[3/4]">
            {(item) => (
              <Image
                source={{ uri: item }}
                style={{ width: width }}
                className="h-full object-cover"
              />
            )}
          </Carousel>
          <View className="p-2">
            <Text className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {data.name}
              {", "}
              {data.age}
            </Text>

            <Text className="text-lg text-zinc-900 dark:text-white font-regular">
              {"TP HCM"}
              {", "}
              {"Việt Nam"}
            </Text>
          </View>

          <View className="flex flex-col mt-6 p-2">
            <Text className="text-zinc-800 dark:text-zinc-200 font-bold mb-2">
              Giới thiệu về bạn ấy
            </Text>
            <Text className="text-black dark:text-white text-left font-medium text-sm">
              {data.bio}
            </Text>
          </View>

          <View className="flex flex-col mt-6 p-2">
            <Text className="text-zinc-800 dark:text-zinc-200 font-bold">
              Sở thích
            </Text>
            <View className="flex-row mt-3 flex-wrap gap-2">
              {data.hobbies.map(
                (hobby: string, index: number) => (
                  <View key={index} className="bg-pri-color rounded-3xl p-2">
                    <Text className="text-white dark:text-white">{hobby}</Text>
                  </View>
                )
              )}
            </View>
          </View>
          {/* Đừng có mà xóa */}
          <View className="pb-20" />
        </View>
      )}
    </ScrollView>
  );
};

export default ProfileDetailScreen;
