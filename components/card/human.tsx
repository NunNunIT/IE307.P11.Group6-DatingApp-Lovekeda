import {
  Dimensions,
  Image,
  Text,
  View,
  Pressable,
} from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import Carousel from "../carousel/type1";
import { Button } from "../ui/button";
import { router } from "expo-router";
import { IdCard } from "@/lib/icons";
import { useLocation } from "@/providers/LocationProvider";
import { haversineDistance } from "@/lib/functions";
const { width, height } = Dimensions.get("window");

const moveToProfileDetail = (id: string) =>
  router.push({
    pathname: "/profile-detail/[id]",
    params: { id },
  });

export default function Tinder({ item }: { item: TProfile }) {
  const { location } = useLocation();
  const isShowDistanceBadge = !!location && item?.locate?.coordinates;
  const distance = haversineDistance(
    {
      lat: location?.[1],
      long: location?.[0],
    },
    {
      lat: item?.locate?.coordinates[1],
      long: item?.locate?.coordinates[0],
    }
  );

  return (
    <View className="relative h-full">
      <Carousel data={item.imgs} containerStyle="h-full">
        {(item) => (
          <Image
            source={{ uri: item }}
            style={{ width: width * 1, height: height * 0.77 }}
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
        onPress={() => moveToProfileDetail(item.user_id)}
        className="absolute bottom-6 justify-start w-full items-start px-4"
      >
        {isShowDistanceBadge && (
          <Text className="bg-green-700 rounded-full p-1 px-3 text-white">
            Cách bạn {distance?.toFixed(2)} km
          </Text>
        )}
        <View className="w-full flex flex-row justify-between items-center ">
          <Text className="text-2xl text-white font-bold">
            {item?.name}
            {", "}
            {item?.age}
          </Text>

          <Button
            size="icon"
            variant="none"
            className="rounded-full p-2 bg-zinc-600/50"
            onPress={() => moveToProfileDetail(item.user_id)}
          >
            <IdCard className="text-white size-6" />
          </Button>
        </View>

        <Text className="text-white text-xl mb-2">
          <Text className="text-xl">❝ </Text>
          {item?.bio}
        </Text>
        <View className="flex flex-row flex-wrap gap-2">
          {(item?.hobbies ?? []).map((hobby, index) => (
            <Text
              key={hobby + index}
              className="bg-zinc-500 text-white rounded-full p-1 px-3"
            >
              {hobby}
            </Text>
          ))}
        </View>
      </Pressable>
    </View>
  );
}
