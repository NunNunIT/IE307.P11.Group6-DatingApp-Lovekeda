import { Image, Text, View } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";

export default function HumanCard2({ item }: { item: TProfile }) {
  return (
    <View className="relative w-full h-full">
      <Image
        source={{ uri: item.imgs[0] }}
        resizeMode="cover"
        className="w-full h-full object-cover"
      />

      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.9)"]}
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          height: "40%",
        }}
        start={{ x: 0.5, y: 0.5 }}
        end={{ x: 0.5, y: 1 }}
      />

      <View className="absolute bottom-3 justify-start w-full items-start px-2">
        <View className="flex-row justify-center items-center ">
          <Text className="text-white">
            {item?.name}
            {", "}
            {item?.age}
          </Text>
        </View>
      </View>
    </View>
  );
}
