import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import React from "react";
import { datesData, matchesData } from "@/constant";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

export default function Matches() {
  return (
    <View className="mt-4">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="space-x-4"
        contentContainerStyle={{
          paddingLeft: hp(2),
          paddingRight: hp(2),
        }}
      >
        {datesData?.map((matches, index) => {
          return (
            <TouchableOpacity
              key={index}
              className="flex items-center space-y-1 min-w-24"
            >
              <View className="rounded-full">
                <Image
                  source={{uri: matches.imgUrl}}
                  style={{
                    width: hp(6),
                    height: hp(6),
                  }}
                  resizeMode="cover"
                  className="rounded-full aspect-square"
                />
              </View>
              <Text
                className="text-zinc-800 dark:text-zinc-200 font-medium text-base"
                style={{
                  fontSize: hp(1.6),
                }}
              >
                {matches.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
