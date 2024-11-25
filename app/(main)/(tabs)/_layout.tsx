import { router, Tabs } from "expo-router";
import React from "react";
import { Platform, View } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { User, Home, MessageCircle, Heart } from "@/lib/icons/IconList";
import DarkModeText from "@/components/darkModeOption/text";
import { Button } from "@/components/ui/button";
import { BadgePlus } from "lucide-react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: true,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Home className="ml-1 size-6 text-zinc-500" />
          ),
          headerRight: () => (
            <View className="flex flex-row gap-3">
              <Button
                // variant="ghost"
                size="icon"
                className="flex flex-row gap-2"
                onPress={() => router.push("/filter")}
              >
                <BadgePlus className="text-black dark:text-white" />
              </Button>
              <Button
                // variant="ghost"
                size="icon"
                className="flex flex-row gap-2"
                onPress={() => router.push("/noti")}
              >
                <BadgePlus className="text-black dark:text-white" />
              </Button>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="matches"
        options={{
          title: "Matches",
          tabBarIcon: ({ color }) => (
            <Heart className="ml-1 size-6 text-zinc-500" />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ color }) => (
            <MessageCircle className="ml-1 size-6 text-zinc-500" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <User className="ml-1 size-6 text-zinc-500" />
          ),
          headerRight: () => (
            <View className="flex flex-row gap-3">
              <Button
                // variant="ghost"
                size="icon"
                className="flex flex-row gap-2"
                onPress={() => router.push("/noti")}
              >
                <BadgePlus className="text-black dark:text-white" />
              </Button>
              <Button
                // variant="ghost"
                size="icon"
                className="flex flex-row gap-2"
                onPress={() => router.push("/settings")}
              >
                <BadgePlus className="text-black dark:text-white" />
              </Button>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
