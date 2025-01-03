import Carousel from "@/components/carousel/type1";
import { Text } from "@/components/ui/text";
import { supabase } from "@/supabase/supabase";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  Dimensions,
  Image,
  View,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Plus, Star } from "~/lib/icons";

const { width } = Dimensions.get("window");

const ProfileDetailScreen = () => {
  const { id, name } = useLocalSearchParams(); // Get dynamic route parameter
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [data, setData] = useState<any>(null); // Data state
  const navigation = useNavigation(); // Điều hướng

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id) return; // Ensure `id` exists
        const response = await fetch(`https://fakestoreapi.com/products/${id}`);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Cập nhật tiêu đề của header theo `name`
  useEffect(() => {
    if (name) {
      navigation.setOptions({
        title: name, // Hiển thị name trên tiêu đề
      });
    }
  }, [name]);

  return (
    <ScrollView className="relative flex-1 w-full h-full">
      {isLoading ? (
        <View className="w-full h-full justify-center items-center">
          <ActivityIndicator size="large" color="#fe183c" />
        </View>
      ) : (
        <View className="flex flex-col gap-3">
          <Image
            source={{ uri: data?.image }}
            style={{ width: width, height: width }}
            className="object-contain"
          />
          <View className="p-2">
            <Text className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {data?.title}
            </Text>
          </View>
          <View className="flex flex-col mt-2 p-2">
            <Text className="text-black dark:text-white text-left font-medium text-sm">
              {data?.description}
            </Text>
          </View>
          <View className="w-full px-2 flex flex-row gap-2 justify-between items-center flex-nowrap">
            <Text className="text-xl font-bold text-red-500 dark:text-red-500 text-left">
              ${data?.price}
            </Text>
            <View className="flex flex-row items-center gap-1">
              <Text className="text-[#f59e0b] font-bold text-xl">
                {data?.rating?.rate?.toFixed(1) || "5"}
              </Text>
              <Star fill={"#f59e0b"} className="size-2 text-[#f59e0b]" />
              <Text className="text-zinc-600 dark:text-zinc-300">
                ({data?.rating?.count})
              </Text>
            </View>
          </View>
          {/* Bottom padding */}
          <View className="pb-20" />
        </View>
      )}
    </ScrollView>
  );
};

export default ProfileDetailScreen;
