import { View, Image, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { profileData } from "@/constant";
import DarkModeSwitch from "@/components/darkModeOption/switch";
import { Button } from "@/components/ui/button";
import { router, Tabs } from "expo-router";
import { Pen } from "@/lib/icons";
import { Text } from "@/components/ui/text";

export default function ProfileScreen() {
  const data = profileData[0];
  return (
    <ScrollView
      className="relative flex-1"
      contentContainerStyle={{
        paddingBottom: hp(5),
        alignItems: "center",
      }}
    >
      {/* Image */}
      <View className="relative m-3">
        <Image source={{ uri: data.imgUrl }} className="rounded-full size-40" />
        <Button size="icon" onPress={() => router.push("/profileDetail/1")}>
          <Text>Edit</Text>
        </Button>
        <Button
          className="rounded-full absolute -bottom-2 -right-2 p-6"
          variant="secondary"
          size="icon"
        >
          <Pen className="text-zinc-500 dark:text-zinc-100" strokeWidth={1.5} />
        </Button>
      </View>

      {/* Bio */}
      <View className="w-full justify-start items-start px-6 space-y-4 mt-6">
        {/* User name and age */}
        <View className="flex-row space-x-2 justify-between w-full items-center">
          <View className="flex-row ">
            <Text className="text-black dark:text-white text-center font-bold text-xl">
              {data.name}
              {", "}
            </Text>
            <Text className="text-black dark:text-white text-center font-bold text-xl ">
              {data.age}
            </Text>
          </View>

          <Button size="icon" onPress={() => router.push("/editProfile")}>
            <Text>Edit</Text>
          </Button>
        </View>

        {/* User hobbies */}
        <View>
          <View className="flex-row">
            {data.hobbies?.map((hobby, index) => (
              <View key={index} className="bg-rose-500 rounded-3xl p-2 mr-2">
                <Text className="text-black dark:text-white ">{hobby}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* User Bio */}
        <View>
          <Text className="uppercase font-semibold text-neutral-500 tracking-wider mb-2 ">
            BIO
          </Text>

          <Text className="text-black dark:text-white/80 text-left font-medium text-sm">
            {data.bio}
          </Text>
        </View>

        <DarkModeSwitch />

        {/*  */}
      </View>
    </ScrollView>
  );
}
