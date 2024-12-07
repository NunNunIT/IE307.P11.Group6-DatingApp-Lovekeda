import React from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";

const mockData = {
  1: {
    title: "Notification 1",
    description: "This is the first notification.",
  },
  2: {
    title: "Notification 2",
    description: "This is the second notification.",
  },
  3: {
    title: "Notification 3",
    description: "This is the third notification.",
  },
};

export default function NotiDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // Correct hook to extract params

  const detail = mockData[id as keyof typeof mockData];

  if (!detail) {
    return (
      <View className="flex-1 justify-center items-center gap-3 p-2">
        <Text className="text-blue-600 dark:text-blue-600 text-3xl font-bold text-center">
          Không tìm thấy thông báo!
        </Text>
        <Text className="text-zinc-800 dark:text-zinc-200 text-xl font-semibold text-center">
          Có vẻ có lỗi xảy ra! Thử lại sau!
        </Text>
        <Button onPress={() => router.back()}><Text>Quay lại</Text></Button>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 p-3">
      <Text className="text-4xl font-semibold text-zinc-950 dark:text-zinc-50 mb-6">
        {detail.title}
      </Text>
      <Text className="text-base text-zinc-800 dark:text-zinc-200">
        {detail.description}
      </Text>
      {/* <Button title="Go Back" onPress={() => router.back()} /> */}
    </ScrollView>
  );
}

export const config = {
  options: {
    headerShown: false, // Tắt header
  },
};