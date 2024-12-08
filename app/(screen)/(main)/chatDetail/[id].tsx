import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Image,
  TouchableOpacity,
  Platform,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ChevronLeftIcon,
  FaceSmileIcon,
  MicrophoneIcon,
  PaperAirplaneIcon,
  PhotoIcon,
} from "react-native-heroicons/outline";
import { EllipsisHorizontalIcon } from "react-native-heroicons/solid";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import ImageUploadType1 from "@/components/imageUpload/type1";
import { router } from "expo-router";
import { Button } from "@/components/ui/button";

const android = Platform.OS === "android";

export default function ChatDetailsScreen() {
  const [message, setMessage] = useState(""); // Lưu trữ tin nhắn trong TextInput
  const [chatList, setChatList] = useState([]); // Danh sách tin nhắn
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu

  const chatData = {
    id: 1,
    name: "Betty",
    imgUrl:
      "https://cdn.aicschool.edu.vn/wp-content/uploads/2024/05/anh-gai-dep-cute.webp",
    age: 32,
  };

  // Mô phỏng tải dữ liệu
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Giả lập gọi API với thời gian chờ
      setTimeout(() => {
        setChatList([
          {
            sender: "me",
            message: "Hi there! How's it going?",
            timestamp: "10:00 AM",
          },
          {
            sender: "Betty",
            message: "I am doing great, thanks!",
            timestamp: "10:05 AM",
          },
        ]);
        setLoading(false); // Dữ liệu đã tải xong
      }, 2000);
    };

    fetchData();
  }, []);

  // Hàm gửi tin nhắn
  const sendMess = () => {
    if (message.trim() === "") return;

    const newMessage = {
      sender: "me",
      message: message.trim(),
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setChatList((prev) => [...prev, newMessage]);
    setMessage("");
  };

  return (
    <SafeAreaView
      className="justify-center items-center relative bg-white dark:bg-black"
      style={{
        paddingTop: android ? hp(4) : 0,
      }}
    >
      {/* Header */}
      <View className="justify-between items-center flex-row w-full px-4 pb-2 border-b border-zinc-400 dark:border-zinc-700">
        <View className="w-2/3 flex flex-row justify-start items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeftIcon size={hp(2.5)} color={"gray"} strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity
            className="w-2/3 flex-row items-center"
            onPress={() => router.push("/profileDetail/1")}
          >
            <View className="border-2 rounded-full border-red-400 mr-2 ml-4">
              <Image
                source={{ uri: chatData.imgUrl }}
                style={{
                  width: hp(4.5),
                  height: hp(4.5),
                }}
                className="rounded-full"
              />
            </View>
            <View className="justify-center items-start">
              <Text className="font-bold text-base text-zinc-800 dark:text-zinc-200">
                {chatData.name}, {chatData.age}
              </Text>
              <Text className="text-xs text-neutral-400">
                You matched today
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View className="w-1/3 items-end ">
          <Button variant="secondary" size="icon" className="rounded-full p-1">
            <EllipsisHorizontalIcon
              size={hp(3)}
              color={"gray"}
              strokeWidth={2}
            />
          </Button>
        </View>
      </View>

      {/* Chat Details */}
      <View className="w-full h-full">
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#fe183c" />
            <Text className="text-sm text-gray-500 mt-2">
              Đang tải tin nhắn...
            </Text>
          </View>
        ) : (
          <FlatList
            data={chatList}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{
              paddingBottom: hp(15),
            }}
            renderItem={({ item }) => (
              <View
                style={{
                  flexDirection: item.sender === "me" ? "row-reverse" : "row",
                  padding: 10,
                  paddingVertical: item.sender === "me" ? 13 : 3,
                }}
              >
                <View
                  style={{
                    maxWidth: "70%",
                  }}
                >
                  <View
                    style={{
                      borderBottomRightRadius: item.sender === "me" ? 0 : 10,
                      borderBottomLeftRadius: item.sender === "me" ? 10 : 0,
                      backgroundColor:
                        item.sender === "me" ? "#212121" : "#fe183c",
                      padding: 10,
                      borderRadius: 10,
                    }}
                  >
                    <Text className="text-white text-base leading-5">
                      {item.message}
                    </Text>
                  </View>

                  <Text
                    className={`text-xs font-semibold text-neutral-500 ${
                      item.sender === "me" ? "text-right" : "text-left"
                    }`}
                  >
                    {"Đã gửi " + item.timestamp}
                  </Text>
                </View>
              </View>
            )}
          />
        )}
      </View>

      {/* Text Input */}
      <View className="absolute max-h-[8rem] flex-row justify-between items-center w-full px-4 pb-12 pt-2 bg-white dark:bg-zinc-900 bottom-0">
        <View className="flex-row items-center rounded-2xl bg-neutral-200 dark:bg-zinc-800 px-3 py-3 w-[85%]">
          <TextInput
            placeholder="Write your message here"
            placeholderTextColor={"gray"}
            value={message}
            onChangeText={setMessage}
            style={{
              fontSize: hp(1.7),
              fontWeight: "medium",
            }}
            className="flex-1 text-base mb-1 pl-1 tracking-wider text-black dark:text-white"
          />

          <View className="w-1/5 flex-row justify-end items-center gap-2">
            <ImageUploadType1
              triggerContent={
                <Button variant="ghost" size="icon">
                  <PhotoIcon size={hp(3)} color={"gray"} strokeWidth={2} />
                </Button>
              }
            />
            <Button variant="ghost" size="icon">
              <FaceSmileIcon size={hp(3)} color={"gray"} strokeWidth={2} />
            </Button>
            <Button variant="ghost" size="icon">
              <MicrophoneIcon size={hp(3)} color={"gray"} strokeWidth={2} />
            </Button>
          </View>
        </View>

        <Pressable
          onPress={sendMess}
          className="bg-pri-color h-full rounded-2xl py-3 w-[13%] justify-center items-center"
        >
          <PaperAirplaneIcon color={"white"} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
