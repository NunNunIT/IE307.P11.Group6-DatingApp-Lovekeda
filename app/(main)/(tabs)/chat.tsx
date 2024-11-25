import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { chatData } from "@/constant";
import { useNavigation } from "@react-navigation/native";
import Matches from "@/components/card/matches";
import { Input } from "@/components/ui/input";
import { Search } from "@/lib/icons/IconList";

// const android = Platform.OS === "android";

export default function ChatScreen() {
  const navigation = useNavigation();
  return (
    <SafeAreaView
      className="mx-2"
      // style={{
      //   paddingTop: android ? hp(3) : 0,
      // }}
    >
      <Matches />

      {/* Search Bar */}
      <Input
        placeholder="Search"
        placeholderTextColor={"gray"}
        // style={{
        //   fontSize: hp(1.7),
        // }}
        className="w-full mt-3"
        startIcon={
          <Search className="size-6 text-zinc-500 dark:text-zinc-600" />
        }
      />

      {/* Chat List */}

      <View className="px-4 mt-3">
        <View className="py-4">
          <Text className="uppercase font-semibold text-zinc-500 tracking-wider ">
            CHAT
          </Text>
        </View>

        <FlatList
          data={chatData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="w-full py-3 items-center flex-row border-b border-zinc-300 dark:border-zinc-600"
              // onPress={() =>
              //   navigation.navigate("ChatDetails", {
              //     chat: item.chat,
              //     imgUrl: item.imgUrl,
              //     name: item.name,
              //     age: item.age,
              //   })
              // }
            >
              {/* Avatar */}
              <View
                className="w-[17%] justify-center"
                style={{
                  width: hp(7),
                  height: hp(7),
                }}
              >
                <Image
                  source={item.imgUrl}
                  style={{
                    width: "90%",
                    height: "90%",
                  }}
                  className="rounded-full"
                />
              </View>

              {/* Information */}
              <View
                className="w-[82%]"
                style={{
                  height: hp(6),
                }}
              >
                <View className="flex-row justify-between items-center">
                  <View className="flex-row justify-center">
                    <View className="flex-row">
                      <Text className="font-bold text-base  text-black dark:text-white">
                        {item.name}
                      </Text>
                    </View>
                    {item.isOnline && (
                      <View className=" justify-center items-center">
                        <View className="w-2 h-2 bg-teal-500 rounded-full ml-1 justify-center items-center"></View>
                      </View>
                    )}
                  </View>
                  <Text className="text-sm text-zinc-800 dark:text-zinc-300 tracking-tight">
                    {item.timeSent}
                  </Text>
                </View>
                <View>
                  <Text className="font-semibold text-xs text-zinc-500 dark:text-zinc-400">
                    {item.lastMessage.length > 45
                      ? item.lastMessage.slice(0, 45) + "..."
                      : item.lastMessage}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
