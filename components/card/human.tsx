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

export default function DatesCard({ item }: { item: any }) {
  return (
    <View className="relative h-full">
      <Carousel data={item.imgs} containerStyle="h-full">
        {(item) => (
          <Image
            source={{ uri: item }}
            style={{
              width: width * 1,
              height: height * 0.77,
            }}
            resizeMode="cover"
            className="h-full object-cover"
          />
        )}
      </Carousel>

      {/* <Text>Hello</Text> */}

      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.9)"]}
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          height: "30%",
        }}
        start={{ x: 0.5, y: 0.5 }}
        end={{ x: 0.5, y: 1 }}
      />

      <Pressable
        onPress={() => router.push(`/profileDetail/${item.id}`)}
        className="absolute bottom-6 justify-start w-full items-start px-4"
      >
        <View className="flex-row justify-center items-center ">
          <Text className="text-2xl text-white font-bold">
            {item?.name}
            {", "}
          </Text>
          <Text className="text-2xl text-white font-bold mr-2">
            {item?.age}
          </Text>
          {/* <CheckBadgeIcon size={25} color={"#3B82F6"} /> */}
          <Button
            size="icon"
            variant="secondary"
            className="rounded-full size-8"
          >
            <IdCard className="text-zinc-600 dark:text-zinc-200 size-6" />
          </Button>
        </View>

        {/* Location */}
        <View className="flex-row justify-center items-center ">
          <Text className="text-lg text-white font-regular">
            {item?.city}
            {", "}
          </Text>
          <Text className="text-lg text-white font-regular mr-2">
            {item?.country}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}
