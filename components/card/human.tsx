import {
  Dimensions,
  TouchableWithoutFeedback,
  Image,
  Text,
  View,
} from "react-native";
import React from "react";
import { CheckBadgeIcon } from "react-native-heroicons/solid";
import { LinearGradient } from "expo-linear-gradient";
import Carousel from "../carousel/type1";

var { width, height } = Dimensions.get("window");

export default function DatesCard({ item, handleClick }) {
  return (
    <View className="relative h-full">
      <TouchableWithoutFeedback onPress={() => handleClick(item)}>
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
      </TouchableWithoutFeedback>

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

      <View className="absolute bottom-6 justify-start w-full items-start px-4">
        <View className="flex-row justify-center items-center ">
          <Text className="text-2xl text-white font-bold">
            {item?.name}
            {", "}
          </Text>
          <Text className="text-2xl text-white font-bold mr-2">
            {item?.age}
          </Text>
          <CheckBadgeIcon size={25} color={"#3B82F6"} />
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
      </View>
    </View>
  );
}
