import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/providers/AuthProvider";
import { useNotifications } from "@/hooks/useNotifications";

export default function NotiScreen() {
  const { profile } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const { data: notifications, error } = useNotifications(profile!.user_id);

  useEffect(() => {
    if (!notifications) return;
    setIsLoading(false);
  }, [notifications]);

  if (error) {
    return (
      <View className="flex flex-1 items-center justify-center">
        <Text className="text-red-500">Error loading notifications</Text>
      </View>
    );
  }

  return (
    <View className="flex flex-1 p-4 bg-zinc-100 dark:bg-black">
      {isLoading ? (
        <View className="flex flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#fe183c" />
        </View>
      ) : (
        <ScrollView className="flex flex-1">
          {notifications?.map((item) => (
            <Pressable
              key={item.id}
              onPress={() =>
                router.push({
                  pathname: "/notification-detail/[id]",
                  params: { id: item.id },
                })
              }
              className="flex flex-row rounded-md overflow-hidden gap-2 p-3 bg-zinc-50 dark:bg-zinc-900 shadow-lg mt-4"
            >
              <View className="w-1/4 items-center p-2">
                <Image
                  source={{ uri: item.img }}
                  resizeMode="cover"
                  className="rounded-lg size-20"
                />
              </View>

              <View className="w-3/4 flex flex-col p-2">
                <Text className="text-lg font-bold line-clamp-2 text-zinc-900 dark:text-zinc-100">
                  {item.title}
                </Text>
                <Text className="text-base line-clamp-3 text-zinc-600 dark:text-zinc-500">
                  {item.desc}
                </Text>
              </View>
            </Pressable>
          ))}
          <View className="h-36 w-full"></View>
        </ScrollView>
      )}
    </View>
  );
}
