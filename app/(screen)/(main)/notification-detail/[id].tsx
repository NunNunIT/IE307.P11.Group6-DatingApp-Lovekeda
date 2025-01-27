import React, { useEffect, useState } from "react";
import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { View, ScrollView, ActivityIndicator, Image } from "react-native";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { doc, getDoc } from "firebase/firestore";
import { database } from "@/utils/firebase";

export default function NotiDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [detail, setDetail] = useState<TNotification | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        if (!id) throw new Error("Notification ID is missing");
        const docRef = doc(database, "notifications", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setDetail({ ...(docSnap.data() as TNotification), id: docSnap.id });
        } else {
          setError("Notification not found");
        }
      } catch (err) {
        console.error("Error fetching notification:", err);
        setError("Failed to fetch notification");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotification();
  }, [id]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#fe183c" />
      </View>
    );
  }

  if (error || !detail) {
    return (
      <View className="flex-1 justify-center items-center gap-3 p-2">
        <Text className="text-blue-600 dark:text-blue-600 text-3xl font-bold text-center">
          Không tìm thấy thông báo!
        </Text>
        <Text className="text-zinc-800 dark:text-zinc-200 text-xl font-semibold text-center">
          {error || "Có vẻ có lỗi xảy ra! Thử lại sau!"}
        </Text>
        <Button onPress={() => router.back()}>
          <Text>Quay lại</Text>
        </Button>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: detail.title || "" }} />
      <ScrollView className="flex-1 p-3">
        <Text className="text-base text-zinc-800 dark:text-zinc-200">
          {detail.desc}
        </Text>
        <Image
          source={{ uri: detail.img }}
          resizeMode="cover"
          className="rounded-lg w-full aspect-square"
        />
      </ScrollView>
    </>
  );
}

export const config = {
  options: {
    headerShown: false,
  },
};
