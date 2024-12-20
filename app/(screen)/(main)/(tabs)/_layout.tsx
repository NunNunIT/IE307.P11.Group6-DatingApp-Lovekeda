import { Redirect, router, Tabs } from "expo-router";
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
import { useLocation } from "@/provider/LocationProvider";

export default function TabLayout() {
  const { permissionStatus } = useLocation();
  if (permissionStatus === "denied") {
    return <Redirect href="/(screen)/(main)/permissionError" />;
  }

  return (
    <Tabs
      screenOptions={{
        // tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: true,
        tabBarShowLabel: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: "#fe183c",
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
          tabBarIcon: ({ color }) => <Home color={color} />,
          headerRight: () => (
            <View className="flex flex-row gap-3 mr-2">
              <Button
                size="icon"
                variant="ghost"
                onPress={() => router.push("/filter")}
              >
                <Settings2 className="size-6 text-black dark:text-white" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
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
          tabBarIcon: ({ color }) => <Heart color={color} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          tabBarIcon: ({ color }) => <MessageCircle color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => <User color={color} />,
          headerRight: () => (
            <View className="flex flex-row gap-3 mr-2">
              <Button
                size="icon"
                variant="ghost"
                onPress={() => router.push("/noti")}
              >
                <Bell className="size-6 text-black dark:text-white" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
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
