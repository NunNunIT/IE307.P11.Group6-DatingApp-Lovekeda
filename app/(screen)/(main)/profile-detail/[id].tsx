import Carousel from "@/components/carousel/type1";
import { Text } from "@/components/ui/text";
import { customizeFetch } from "@/lib/functions";
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { Dimensions, Image, View, ScrollView } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import useSWR from "swr";

const { width } = Dimensions.get("window");

export default function ProfileDetailScreen() {
  const { id } = useLocalSearchParams();
  const { isLoading, data } = useSWR<TProfile>(`/users/${id}`, customizeFetch);
  const { data: location } = useSWR<{ display_name: string }>(
    data?.locate?.coordinates
      ? `/common/location?lat=${data.locate.coordinates[1]}&long=${data.locate.coordinates[0]}`
      : null,
    customizeFetch
  );

  const isLoadingData = isLoading || !data;

  return (
    <>
      <Stack.Screen options={{ title: data?.name || "", headerShown: true }} />
      <ScrollView className="relative flex-1 w-full h-full">
        <Spinner visible={isLoadingData} />
        {!isLoadingData && (
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
                {location?.display_name ?? "Đang tải..."}
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
                {data.hobbies.map((hobby: string, index: number) => (
                  <View key={index} className="bg-pri-color rounded-3xl p-2">
                    <Text className="text-white dark:text-white">{hobby}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Đừng có mà xóa */}
            <View className="pb-20" />
          </View>
        )}
      </ScrollView>
    </>
  );
}
