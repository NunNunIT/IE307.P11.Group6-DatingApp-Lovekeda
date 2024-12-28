import React, { useState, useLayoutEffect, useCallback } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import {
  collection,
  addDoc,
  orderBy,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth, database } from "@/config/firebase";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import colors from "@/config/colors";
import { useAuth } from "@/provider/AuthProvider";
import { useLocalSearchParams } from "expo-router";
import ImageUploadType1 from "@/components/imageUpload/type1";
import { Button } from "@/components/ui/button";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

const isAndroid = Platform.OS === "android";

export default function Chat() {
  const { session, profile } = useAuth();
  const { id: other } = useLocalSearchParams();
  const [messages, setMessages] = useState([]);
  // const navigation = useNavigation();
  const [imgs, setImgs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const me = session?.user?.id; // Current user id

  // Fetch messages
  useLayoutEffect(() => {
    const collectionRef = collection(database, "chats");

    const q = query(
      collectionRef,
      where("sender", "in", [me, other]),
      where("receiver", "in", [me, other]),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      return setMessages(
        querySnapshot.docs.map((doc) => ({
          _id: doc.data()._id,
          createdAt: doc.data().createdAt.toDate(),
          text: doc.data().text,
          image: doc.data().image || null, // Handle image messages
          sender: doc.data().sender,
          receiver: doc.data().receiver,
          user: doc.data().user,
        }))
      );
      setIsLoading(false); // Ngừng trạng thái tải khi dữ liệu đã sẵn sàng
    });

    return unsubscribe;
  }, [me, other]);

  // Handle sending messages
  const onSend = useCallback(
    async (messages = []) => {
      try {
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, messages)
        );

        const { _id, createdAt, text, user } = messages[0];
        const validAvatar =
          profile?.imgs?.[0] ?? "https://example.com/default-avatar.png";

        await addDoc(collection(database, "chats"), {
          _id,
          text,
          image: imgs[0] || null,
          sender: me,
          user,
          receiver: other,
          createdAt,
        });

        // Clear images after successful send
        if (imgs.length > 0) {
          setImgs([]);
        }
      } catch (error) {
        console.error("Failed to send message:", error);
        // Revert optimistic update
        setMessages((previousMessages) =>
          previousMessages.filter((msg) => msg._id !== messages[0]._id)
        );
        // Show error to user
        Alert.alert("Error", "Failed to send message. Please try again.");
      }
    },
    [me, other, profile, imgs]
  );

  return (
    <SafeAreaView
      className="justify-center items-center relative bg-white dark:bg-black"
      style={{
        paddingTop: isAndroid ? hp(4) : 0,
      }}
    >
      <View className="justify-between items-center flex-row w-full px-4 pb-2 border-b border-zinc-400 dark:border-zinc-700">
        <View className="w-2/3 flex flex-row justify-start items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeftIcon size={hp(2.5)} color={"gray"} strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity
            className="w-2/3 flex-row items-center"
            onPress={() => router.push(`/profileDetail/${id}`)}
          >
            <View className="border-2 rounded-full border-red-400 mr-2 ml-4">
              <Image
                source={{ uri: userData?.imgs[0] }}
                style={{
                  width: hp(4.5),
                  height: hp(4.5),
                }}
                className="rounded-full"
              />
            </View>
            <View className="justify-center items-start">
              <Text className="font-bold text-base text-zinc-800 dark:text-zinc-200">
                {userData?.name}, {userData?.age}
              </Text>
              <Text className="text-xs text-neutral-400">
                You matched today
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View className="w-1/3 items-end">
          <Button variant="secondary" size="icon" className="rounded-full p-1">
            <EllipsisHorizontalIcon
              size={hp(3)}
              color={"gray"}
              strokeWidth={2}
            />
          </Button>
        </View>
      </View>

      <View className="w-full h-full">
        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#fe183c" />
            <Text className="text-sm text-gray-500 mt-2">
              Đang tải tin nhắn...
            </Text>
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <GiftedChat
              messages={messages}
              showAvatarForEveryMessage={false}
              showUserAvatar={false}
              onSend={(messages) => onSend(messages)}
              messagesContainerStyle={{
                backgroundColor: "#fff",
              }}
              textInputStyle={{
                backgroundColor: "#fff",
                borderRadius: 20,
              }}
              user={{
                _id: me,
                avatar: "https://i.pravatar.cc/500",
              }}
            />

            {/* Image Upload Section */}
            <View
              style={{
                padding: 10,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <ImageUploadType1
                imgs={imgs}
                setImgs={setImgs}
                triggerContent={
                  <Button>
                    <Text>Upload Image</Text>
                  </Button>
                }
              />

              {!!profile?.imgs?.[0] && (
                <Image src={imgs[0]} className="w-10 h-10 rounded-full" />
              )}
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
