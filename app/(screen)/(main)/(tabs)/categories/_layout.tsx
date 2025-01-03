import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { router, Slot } from "expo-router";

const categories = [
  {
    id: "all",
    name: "all",
    icon: require("~/assets/images/all.png"), // thay đường dẫn bằng icon tương ứng
    title: "All",
  },
  {
    id: "electronics",
    name: "electronics",
    icon: require("~/assets/images/electronics.png"),
    title: "Electronics",
  },
  {
    id: "jewelery",
    name: "jewelery",
    icon: require("~/assets/images/jewelery.png"),
    title: "Jewelery",
  },
  {
    id: "mens-clothing",
    name: "men's clothing",
    icon: require("~/assets/images/mens-clothing.png"),
    title: "Men's clothing",
  },
  {
    id: "womens-clothing",
    name: "women's clothing",
    icon: require("~/assets/images/womens-clothing.png"),
    title: "Women's clothing",
  },
];

export default function Categories() {
  const [activeCategory, setActiveCategory] = useState("all");

  return (
    <View className="h-full">
      <View className="w-full h-1/6 min-h-16 max-h-32 mb-2 px-4">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex flex-row gap-3"
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              className={`rounded-md w-[20%] aspect-[4/3] flex items-center justify-center shadow-md ${
                activeCategory === category.id
                  ? "bg-blue-500"
                  : "bg-white dark:bg-zinc-900"
              }`}
              onPress={() => {
                setActiveCategory(category.id);
                router.push(`/categories/${category.id}?name=${category.name}`);
              }}
            >
              <Image
                source={category.icon}
                className="w-12 h-12 mb-2"
                resizeMode="contain"
              />
              <Text
                className={`text-center text-sm font-bold ${
                  activeCategory === category.id
                    ? "text-white"
                    : "text-zinc-900"
                }`}
              >
                {category.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <Slot />
    </View>
  );
}
