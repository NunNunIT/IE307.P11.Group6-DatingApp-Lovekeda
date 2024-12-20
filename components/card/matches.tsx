import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import React from "react";
import { datesData, matchesData } from "@/constant";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { router } from "expo-router";

export default function Matches() {
  return (
    <View className="">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {datesData?.map((matches, index) => {
          return (
            <TouchableOpacity
              key={index}
              className="flex items-center max-w-24 px-3"
              onPress={() => router.push("/chatDetail/1")}
            >
              <Image
                source={{ uri: matches.imgs[0] }}
                resizeMode="cover"
                className="rounded-full w-full aspect-square size-16"
              />
              <Text
                className="mt-2 text-zinc-800 dark:text-zinc-200 font-medium text-base text-nowrap line-clamp-1"
                style={{
                  fontSize: hp(1.6),
                }}
              >
                {matches.name?.split(' ').slice(-1)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
