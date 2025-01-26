import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { Input } from "@/components/ui/input";
import { Search } from "@/lib/icons";
import { router } from "expo-router";
import Matches from "@/components/card/matches";
import { useAuth } from "@/provider/AuthProvider";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { database } from "@/utils/firebase";
import colors from "@/config/colors";
import { DATE_DATA } from "@/constants/data";
import { customizeFetch } from "@/lib/functions";

const ChatItem: React.FC<any> = ({ item, other, onPress }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  console.log("ITEM", item);
  console.log("OTHER", other);

  useEffect(() => {
    (async () => {
      try {
        const data = await customizeFetch(`/users/${other}`);
        setData(data);
      } catch (err) {
        setError("Đã xảy ra lỗi.");
      } finally {
        setLoading(false);
      }
    })();
  }, [item.id]);
  console.log("ATA222222", data);

  if (loading) {
    return (
      <View className="flex-row items-center justify-center py-4">
        <Text className="text-gray-500 dark:text-gray-400">Đang tải...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-row items-center justify-center py-4">
        <Text className="text-red-500">{error}</Text>
      </View>
    );
  }

  return (
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
          source={{ uri: data?.imgs?.[0] || "https://via.placeholder.com/150" }}
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
                {data.name}
              </Text>
            </View>
          </View>
          {/* <Text className="text-sm text-zinc-800 dark:text-zinc-300 tracking-tight">
            {item.timeSent}
          </Text> */}
        </View>
        <View>
          <Text className="font-semibold text-xs text-zinc-500 dark:text-zinc-400">
            {!!item.text ? item.text : "No messages yet."}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function ChatScreen() {
  const { profile } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [chatRoom, setChatRoom] = useState<
    Array<{
      id: string;
      participants: string[];
      createdAt: any;
      receiver: string;
      sender: string;
      text?: string;
    }>
  >([]);
  const me = profile!.user_id;

  useLayoutEffect(() => {
    const collectionRef = collection(database, "chats");
    const q = query(
      collectionRef,
      where("participants", "array-contains", me),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const chats: Array<{
          id: string;
          participants: string[];
          createdAt: any;
          receiver: string;
          sender: string;
          text?: string;
        }> = querySnapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as any)
        );

        const uniqueChats: React.SetStateAction<
          {
            id: string;
            participants: string[];
            createdAt: any;
            receiver: string;
            sender: string;
            text?: string;
          }[]
        > = [];
        const seenParticipants = new Set();

        chats.forEach((chat) => {
          const participantsKey = chat.participants
            .sort() // Chuẩn hóa danh sách người tham gia
            .join(","); // Tạo chuỗi khóa duy nhất cho mỗi danh sách người tham gia

          if (!seenParticipants.has(participantsKey)) {
            seenParticipants.add(participantsKey);
            uniqueChats.push(chat);
          }
        });

        setChatRoom(uniqueChats);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching chat rooms: ", error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [me]);

  console.log(chatRoom);

  // Filter out the current user
  const filteredData = DATE_DATA.filter(
    (item) => item.user_id !== session?.user?.id
  );

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black py-4">
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

      {/* Chat List Header */}
      <Text className="uppercase font-semibold text-zinc-500 tracking-wider py-2 px-4">
        Trò chuyện
      </Text>

      {/* Loading State */}
      {isLoading ? (
        <View className="flex-1 justify-center items-center px-4">
          <ActivityIndicator size="large" color={colors.primary} />
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
          {chatRoom.slice(0, 3).map((item) => (
            <ChatItem
              key={item.id}
              item={item}
              other={item.receiver !== me ? item.receiver : item.sender}
              onPress={() =>
                router.push({
                  pathname: "/chatDetail/:id",
                  params: {
                    id: item.receiver !== me ? item.receiver : item.sender,
                  },
                })
              }
            />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
