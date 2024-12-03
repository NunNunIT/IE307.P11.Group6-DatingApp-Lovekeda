import Carousel from "@/components/carousel/type1";
import React, { useState } from "react";
import { Dimensions, Image, View } from "react-native";

const { width } = Dimensions.get("window");

const IMAGES = [
  "https://images.pexels.com/photos/2529159/pexels-photo-2529159.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  "https://images.pexels.com/photos/2529158/pexels-photo-2529158.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=600",
  "https://images.pexels.com/photos/2529146/pexels-photo-2529146.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  "https://images.pexels.com/photos/2529158/pexels-photo-2529158.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
];

const profileDetailScreen = () => {
  return (
    <View>
      <Carousel data={IMAGES} containerStyle="h-fit aspect-[3/4]">
        {(item) => (
          <Image
            source={{ uri: item }}
            style={{ width: width }}
            className="h-full object-cover"
          />
        )}
      </Carousel>
    </View>
  );
};

export default profileDetailScreen;
