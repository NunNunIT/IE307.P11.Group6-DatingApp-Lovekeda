import { router, Tabs } from "expo-router";
import React from "react";
import { Image, Platform, View } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  User,
  Home,
  MessageCircle,
  Heart,
  Bell,
  Settings,
  Settings2,
} from "@/lib/icons";
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
        headerLeft: () => (
          <Image
            source={require("~/assets/images/logo2.png")}
            resizeMode="cover"
            className="relative w-60 h-14 ml-2"
          />
        ),
        headerTitle: "",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => (
            <Home className="ml-1 size-6 text-zinc-500" />
          ),
          headerRight: () => (
            <View className="flex flex-row gap-3 mr-2">
              <Button
                // variant="ghost"
                size="icon"
                variant="ghost"
                className="flex flex-row gap-2"
                onPress={() => router.push("/filter")}
              >
                <Settings2 className="size-6 text-black dark:text-white" />
              </Button>
              <Button
                // variant="ghost"
                size="icon"
                variant="ghost"
                className="flex flex-row gap-2"
                onPress={() => router.push("/noti")}
              >
                <Bell className="size-6 text-black dark:text-white" />
              </Button>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="matches"
        options={{
          tabBarIcon: ({ color }) => (
            <Heart className="ml-1 size-6 text-zinc-500" />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          tabBarIcon: ({ color }) => (
            <MessageCircle className="ml-1 size-6 text-zinc-500" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => (
            <User className="ml-1 size-6 text-zinc-500" />
          ),
          headerRight: () => (
            <View className="flex flex-row gap-3">
              <Button
                // variant="ghost"
                size="icon"
                variant="ghost"
                className="flex flex-row gap-2"
                onPress={() => router.push("/noti")}
              >
                <Bell className="size-6 text-black dark:text-white" />
              </Button>
              <Button
                // variant="ghost"
                size="icon"
                variant="ghost"
                className="flex flex-row gap-2"
                onPress={() => router.push("/settings")}
              >
                <Settings className="size-6 text-black dark:text-white" />
              </Button>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
