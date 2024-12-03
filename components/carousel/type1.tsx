import React, { useState } from "react";
import {
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";

const { width } = Dimensions.get("window");
// Cách sử dụng
{
  /* <Carousel data={IMAGES}>
{(item) => (
  <Image source={{ uri: item }} style={{ width: width, height: 300 }} />
)}
</Carousel> */
}

const Carousel = ({
  data,
  containerStyle,
  children,
}: {
  data: any;
  containerStyle?: string;
  children: (item: any) => JSX.Element;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < data.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleDotPress = (index: number) => {
    setCurrentIndex(index);
  };

  const renderItem = ({ item }: { item: any }) => {
    return children(item);
  };

  return (
    <View className={`relative ${containerStyle ?? ""}`}>
      {/* Slide Images */}
      <FlatList
        data={data}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        keyExtractor={(item, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.floor(
            event.nativeEvent.contentOffset.x /
              event.nativeEvent.layoutMeasurement.width
          );
          setCurrentIndex(index);
        }}
        contentOffset={{ x: currentIndex * width, y: 0 }}
        className="flex-grow-0 z-0 w-full h-full"
      />

      {/* Navigation Buttons */}
      <View className="absolute top-6 left-0 z-5 w-1/6 h-full ">
        <TouchableOpacity
          onPress={handlePrev}
          disabled={currentIndex === 0}
          className="z-5 h-full opacity-0"
        >
          <Text className="opacity-0">Prev</Text>
        </TouchableOpacity>
      </View>

      <View className="absolute top-6 right-0 z-5 w-1/6 h-full">
        <TouchableOpacity
          onPress={handleNext}
          disabled={currentIndex === data.length - 1}
          className="relative z-5 h-full opacity-0"
        >
          <Text className="opacity-0">Next</Text>
        </TouchableOpacity>
      </View>

      {/* Pagination */}
      <View className="absolute z-10 top-2 flex flex-row gap-2 justify-center px-3">
        {data.map((_: any, index: number) => (
          <TouchableOpacity
            key={index}
            className={`flex-1 h-3 rounded-full ${
              currentIndex === index ? "bg-white" : "bg-white/50"
            }`}
            onPress={() => handleDotPress(index)}
          />
        ))}
      </View>
    </View>
  );
};

export default Carousel;
