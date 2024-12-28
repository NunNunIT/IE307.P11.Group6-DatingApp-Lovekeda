import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { DATE_DATA } from "@/constant";

const mockData = [
  {
    _id: "1",
    img: "https://via.placeholder.com/100",
    title: "User 1",
    desc: "This is a description for User 1.",
  },
  {
    _id: "2",
    img: "https://via.placeholder.com/100",
    title: "User 2",
    desc: "This is a description for User 2.",
  },
  {
    _id: "3",
    img: "https://via.placeholder.com/100",
    title: "User 3",
    desc: "This is a description for User 3.",
  },
  {
    _id: "4",
    img: "https://via.placeholder.com/100",
    title: "User 1",
    desc: "This is a description for User 1.",
  },
  {
    _id: "5",
    img: "https://via.placeholder.com/100",
    title: "User 2",
    desc: "This is a description for User 2.",
  },
  {
    _id: "6",
    img: "https://via.placeholder.com/100",
    title: "User 3",
    desc: "This is a description for User 3.",
  },
  {
    _id: "7",
    img: "https://via.placeholder.com/100",
    title: "User 1",
    desc: "This is a description for User 1.",
  },
  {
    _id: "8",
    img: "https://via.placeholder.com/100",
    title: "User 2",
    desc: "This is a description for User 2.",
  },
  {
    _id: "9",
    img: "https://via.placeholder.com/100",
    title: "User 3",
    desc: "This is a description for User 3.",
  },
];

export default function NotiScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    // Giả lập quá trình tải dữ liệu
    setTimeout(() => {
      setData(mockData);
      setIsLoading(false);
    }, 2000); // Thời gian tải giả lập
  }, []);

  

  return (
    <View className="flex flex-1 p-4 bg-zinc-100 dark:bg-black">
      {isLoading ? (
        <View className="flex flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#fe183c" />
        </View>
      ) : (
        <ScrollView className="flex flex-1">
          {DATE_DATA.map((item) => (
            <Pressable
              key={item.imgs[0]}
              onPress={() => router.push(`/notiDetail/${item.imgs[0]}`)}
              className="flex flex-row rounded-md overflow-hidden gap-2 p-3 bg-zinc-50 dark:bg-zinc-900 shadow-lg mt-4"
            >
              <View className="w-1/4 items-center p-2">
                <Image
                  source={{ uri: item.imgs[0] }}
                  resizeMode="cover"
                  className="rounded-lg size-20"
                />
              </View>

              <View className="w-3/4 flex flex-col p-2">
                <Text className="text-lg font-bold line-clamp-2 text-zinc-900 dark:text-zinc-100">
                  Bạn và <Text className="font-bold">{item.name}</Text> đã kết nối với nhau
                </Text>
                <Text className="text-base line-clamp-3 text-zinc-600 dark:text-zinc-500">
                  Nhắn tin và tìm hiểu nhau ngay
                </Text>
              </View>
            </Pressable>
          ))}
          <View className="h-36 w-full"></View>
        </ScrollView>
      )}
    </View>
  );
}
