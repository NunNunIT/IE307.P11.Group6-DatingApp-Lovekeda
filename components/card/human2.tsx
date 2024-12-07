import {
  Dimensions,
  TouchableWithoutFeedback,
  Image,
  Text,
  View,
  Pressable,
} from "react-native";
import React from "react";
import { CheckBadgeIcon } from "react-native-heroicons/solid";
import { LinearGradient } from "expo-linear-gradient";
import Carousel from "../carousel/type1";
import { Button } from "../ui/button";
import { router } from "expo-router";
import { IdCard } from "@/lib/icons";
var { width, height } = Dimensions.get("window");

export default function HumanCard2({ item, handleClick }) {
  return (
    <View className="relative w-full h-full">
      <Image
        source={{ uri: item.imgs[0] }}
        // style={{
        //   width: width * 1,
        //   height: height * 0.77,
        // }}
        resizeMode="cover"
        className="w-full h-full object-cover"
      />
      {/* <Text>Hello</Text> */}

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
