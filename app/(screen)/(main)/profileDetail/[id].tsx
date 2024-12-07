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
    <ScrollView className="flex-1 flex-col gap-3">
      {loading ? (
        <View className="flex-1 h-full justify-center items-center">
          <ActivityIndicator size="large" color="#fe183c" />
        </View>
      ) : (
        <>
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

            <Text className="text-lg text-white font-regular">
              {"TP HCM"}
              {", "}
              {"Việt Nam"}
            </Text>
          </View>

          <View className="p-2">
            <Text className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Sở thích
              {", "}
              {19}
            </Text>

            <Text className="text-lg text-white font-regular">
              {"TP HCM"}
              {", "}
              {"Việt Nam"}
            </Text>
          </View>
          {/* Đừng có mà xóa */}
          <View className="pb-20" />
        </>
      )}
    </ScrollView>
  );
};

export default ProfileDetailScreen;
