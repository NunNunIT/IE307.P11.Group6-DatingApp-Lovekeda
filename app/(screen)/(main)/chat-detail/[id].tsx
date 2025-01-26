import React, { useState, useLayoutEffect, useCallback } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Actions,
  GiftedChat,
  IMessage,
  InputToolbar,
  Send,
} from "react-native-gifted-chat";
import {
  collection,
  addDoc,
  orderBy,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { database } from "@/utils/firebase";
import { FontAwesome } from "@expo/vector-icons";
import { useAuth } from "@/provider/AuthProvider";
import { router, useLocalSearchParams } from "expo-router";
import ImageUploadType1 from "@/components/imageUpload/type1";
import { Button } from "@/components/ui/button";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { ImageIcon } from "@/lib/icons";
import {
  ChevronLeftIcon,
  EllipsisHorizontalIcon,
} from "react-native-heroicons/solid";
import { customizeFetch } from "@/lib/functions";

const isAndroid = Platform.OS === "android";

export default function Chat() {
  const { profile } = useAuth();
  const { id: other } = useLocalSearchParams();
  const [data, setData] = useState<TProfile | undefined>(undefined);
  useLayoutEffect(() => {
    (async () => {
      const data = await customizeFetch(`/users/${other}`);
      setData(data);
    })();
  }, []);

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [imgs, setImgs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const me = profile!.user_id;

  useLayoutEffect(() => {
    const collectionRef = collection(database, "chats");
    const q = query(
      collectionRef,
      where("sender", "in", [me, other]),
      where("receiver", "in", [me, other]),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setMessages(
        querySnapshot.docs.map((doc) => ({
          _id: doc.data()._id,
          createdAt: doc.data().createdAt.toDate(),
          text: doc.data().text,
          image: doc.data().image || null,
          sender: doc.data().sender,
          receiver: doc.data().receiver,
          user: doc.data().user,
        }))
      );
      setIsLoading(false);
    });

    return unsubscribe;
  }, [me, other]);

  const onSend = useCallback(
    async (messages: IMessage[] = []) => {
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
          participants: [me, other],
          createdAt,
        });

        setImgs([]);
      } catch (error) {
        console.error("Failed to send message:", error);
        setMessages((previousMessages: IMessage[]) =>
          previousMessages.filter(
            (msg: IMessage) => msg._id !== messages[0]._id
          )
        );
        Alert.alert("Error", "Failed to send message. Please try again.");
      }
    },
    [me, other, profile, imgs]
  );

  const CustomInputToolbar = (props: any) => (
    <View className="relative w-full flex flex-col h-fit border-t-2 border-t-[#ccc] pt-2">
      {!!imgs?.[0] && <Image src={imgs[0]} className="size-24 rounded-md" />}
      <InputToolbar
        {...props}
        containerStyle={{
          backgroundColor: "transparent",
          borderTopWidth: 0,
          borderTopColor: "transparent",
        }}
      />
    </View>
  );

  const CustomActions = (props: any) => (
    <Actions
      {...props}
      icon={() => (
        <ImageUploadType1
          imgs={imgs}
          setImgs={setImgs}
          triggerContent={
            <Button variant="secondary" size="icon">
              <ImageIcon className="size-6 text-zinc-600" />
            </Button>
          }
        />
      )}
      onPressActionButton={() => console.log("Action button pressed!")}
    />
  );

  const CustomSend = (props: any) => (
    <Send {...props}>
      <FontAwesome name="send" size={24} color="blue" style={{ margin: 5 }} />
    </Send>
  );

  return (
    <SafeAreaView
      className="justify-center items-center relative bg-white dark:bg-black"
      style={{ paddingTop: isAndroid ? hp(4) : 0 }}
    >
      <View className="justify-between items-center flex-row w-full px-4 pb-2 border-b border-zinc-400 dark:border-zinc-700">
        <View className="w-2/3 flex flex-row justify-start items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeftIcon size={hp(2.5)} color={"gray"} strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity
            className="w-2/3 flex-row items-center"
            onPress={moveToProfileDetail(other)}
          >
            <View className="border-2 rounded-full border-red-400 mr-2 ml-4">
              <Image
                source={{ uri: data?.imgs[0] }}
                style={{ width: hp(4.5), height: hp(4.5) }}
                className="rounded-full"
              />
            </View>
            <View className="justify-center items-start">
              <Text className="font-bold text-base text-zinc-800 dark:text-zinc-200">
                {data?.name}, {data?.age}
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
          <View className="flex-[0.9]">
            <GiftedChat
              messages={messages}
              showAvatarForEveryMessage={false}
              showUserAvatar={false}
              onSend={(messages) => {
                const customMessages = messages.map((msg) => ({
                  ...msg,
                  sender: me,
                  receiver: other,
                }));
                onSend(customMessages as IMessage[]);
              }}
              messagesContainerStyle={{
                backgroundColor: "#fff",
              }}
              textInputProps={{
                style: {
                  backgroundColor: "#fff",
                  borderRadius: 20,
                },
              }}
              renderInputToolbar={(props) => <CustomInputToolbar {...props} />}
              renderActions={(props) => <CustomActions {...props} />}
              renderSend={(props) => <CustomSend {...props} />}
              user={{
                _id: me,
                avatar: "https://i.pravatar.cc/500",
              }}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

function moveToProfileDetail(other: string | string[]) {
  return () => router.push(`/profile-detail/${other}`);
}
