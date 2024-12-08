import Carousel from "@/components/carousel/type1";
import { Text } from "@/components/ui/text";
import React, { useState, useEffect } from "react";
import {
  Dimensions,
  Image,
  View,
  ActivityIndicator,
  ScrollView,
} from "react-native";

const { width } = Dimensions.get("window");

const IMAGES = [
  "https://images.pexels.com/photos/2529159/pexels-photo-2529159.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  "https://images.pexels.com/photos/2529158/pexels-photo-2529158.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=600",
  "https://images.pexels.com/photos/2529146/pexels-photo-2529146.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  "https://images.pexels.com/photos/2529158/pexels-photo-2529158.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
];

const ProfileDetailScreen = () => {
  const [loading, setLoading] = useState(true); // Trạng thái tải

  // Giả lập việc tải dữ liệu
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // Sau 2 giây, kết thúc tải
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ScrollView className="relative flex-1 w-full h-full">
      {loading ? (
        <View className="w-full h-full justify-center items-center">
          <ActivityIndicator size="large" color="#fe183c" />
        </View>
      ) : (
        <View className="flex flex-col gap-3">
          <Carousel data={IMAGES} containerStyle="h-fit aspect-[3/4]">
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
              Tên người dùng
              {", "}
              {19}
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
              {
                "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
              }
            </Text>
          </View>

          <View className="flex flex-col mt-6 p-2">
            <Text className="text-zinc-800 dark:text-zinc-200 font-bold">
              Sở thích
            </Text>
            <View className="flex-row mt-3 flex-wrap gap-2">
              {["cook1", "cook2", "cook3", "cook4", "cook5", "cook6"].map(
                (hobby, index) => (
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
