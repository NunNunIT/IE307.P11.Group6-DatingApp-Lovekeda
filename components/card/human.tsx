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
import { haversineDistance } from "@/lib/functions";
import { useLocation } from "@/provider/LocationProvider";
var { width, height } = Dimensions.get("window");

export default function DatesCard({ item }: { item: any }) {
  // console.log("🚀 ~ DatesCard ~ item:", item)
  const { location } = useLocation();
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
        {!!location && item.coordinates && <Text className="bg-green-700 rounded-full p-1 px-3 text-white">
          Cách bạn {haversineDistance(
            { lat: location[0], long: location[1] },
            { lat: item.coordinates[0], long: item.coordinates[1] })?.toFixed(2)} km
        </Text>}
        <View className="w-full flex flex-row justify-between items-center ">
          <Text className="text-2xl text-white font-bold">
            {item?.name}
            {", "}
            {item?.age}
          </Text>

          {/* <CheckBadgeIcon size={25} color={"#3B82F6"} /> */}
          <Button
            size="icon"
            variant="none"
            className="rounded-full p-2 bg-zinc-600/50"
            onPress={() => router.push(`/profileDetail/${item.id}`)}
          >
            <IdCard className="text-white size-6" />
          </Button>
        </View>

        {/* Location */}
        {/* <View className="flex-row justify-center items-center ">
          <Text className="text-lg text-white font-regular">
            {item?.city}
            {", "}
          </Text>
          <Text className="text-lg text-white font-regular mr-2">
            {item?.country}
          </Text>
        </View> */}

        <Text className="text-white text-xl mb-2">
          <Text className="text-xl">❝ </Text>
          {item?.bio}
        </Text>
        <View className="flex flex-row flex-wrap gap-2">
          {item?.hobbies?.map((hobby: any, index: any) => (
            <Text key={index} className="bg-zinc-500 text-white rounded-full p-1 px-3">
              {hobby}
            </Text>
          ))}
        </View>
      </Pressable>
    </View>
  );
}
