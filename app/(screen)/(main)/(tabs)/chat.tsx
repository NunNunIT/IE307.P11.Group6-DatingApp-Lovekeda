import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { chatData } from "@/constant";
import { Input } from "@/components/ui/input";
import { Search } from "@/lib/icons";
import { router } from "expo-router";
import Matches from "@/components/card/matches";

const ChatItem = ({ item, onPress }: { item: any, onPress: any }) => (
  <TouchableOpacity
    onPress={onPress}
    className="w-full py-2 items-center flex-row border-b border-zinc-300 dark:border-zinc-600 px-4"
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
    <View className="w-[82%]" style={{ height: hp(6) }}>
      <View className="flex-row justify-between items-center">
        <View className="flex-row justify-center">
          <View className="flex-row">
            <Text className="font-bold text-base text-black dark:text-white">
              {item.name}
            </Text>
          </View>
          {item.isOnline && (
            <View className="justify-center items-center">
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
);

export default function ChatScreen() {
  const [isLoading, setIsLoading] = useState<boolean>(true); // Trạng thái tải dữ liệu

  useEffect(() => {
    // Giả lập thời gian tải dữ liệu
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 giây

    return () => clearTimeout(timeout); // Xóa timeout khi component unmount
  }, []);

  return (
    <View className="flex-1 bg-white dark:bg-black py-4">
      {/* Matches Component */}
      <Matches />

      {/* Search Bar */}
      <View className="my-2 px-4">
        <Input
          placeholder="Search"
          placeholderTextColor={"gray"}
          className="rounded-full"
          startIcon={
            <Search className="size-6 ml-2 text-zinc-500 dark:text-zinc-600" />
          }
        />
      </View>

      {/* Chat List */}
      <Text className="uppercase font-semibold text-zinc-500 tracking-wider py-2 px-4">
        Trò chuyện
      </Text>
      {isLoading ? (
        <View className="flex-1 justify-center items-center px-4">
          <ActivityIndicator size="large" color="#fe183c" />
          <Text className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Đang tải danh sách...
          </Text>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingBottom: hp(5),
          }}
        >
          <View>
            {chatData.map((item) => (
              <ChatItem
                key={item.id}
                item={item}
                onPress={() => router.push("/chatDetail/1")}
              />
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
