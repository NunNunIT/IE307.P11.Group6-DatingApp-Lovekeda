import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ChevronLeftIcon,
  MicrophoneIcon,
  PaperAirplaneIcon,
  PhotoIcon,
} from "react-native-heroicons/outline";
import React, { useEffect, useState } from "react";

import { Audio } from "expo-av";
import { Button } from "@/components/ui/button";
import { EllipsisHorizontalIcon } from "react-native-heroicons/solid";
import ImageUploadType1 from "@/components/imageUpload/type1";
import { SafeAreaView } from "react-native-safe-area-context";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { router, useLocalSearchParams } from "expo-router";
import { CHAT_DATA, USER_DATA } from "@/constant";

const isAndroid = Platform.OS === "android";

export default function ChatDetailsScreen() {
  const { id } = useLocalSearchParams();
  // const chatData = CHAT_DATA.find((item) => item.id === id);
  // if (!chatData) return NotFoundScreen();
  const userData = USER_DATA.find((item) => item.id.toString() === id);
  const [setChatData] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [chatList, setChatList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [recording, setRecording] = useState<Audio.Recording | undefined>(undefined);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [playingSound, setPlayingSound] = useState<Audio.Sound | null>(null);
  const [imgs, setImgs] = useState<string[]>([]); // Mảng hình ảnh

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setTimeout(() => {
        const chatData = CHAT_DATA.find((item) => item.id === id);
        if (!chatData) return;
        setChatData(chatData);
        setChatList([...chatData?.chat]);
        setIsLoading(false);
      }, 1000);
    };

    fetchData();
  }, []);

  const sendMess = () => {
    if (message.trim() === "" && imgs.length === 0 && !audioUri) return;

    const newMessage = {
      sender: "me",
      message: message.trim(),
      images: imgs,
      audio: audioUri,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setChatList((prev) => [...prev, newMessage]);
    setMessage("");
    setImgs([]);
    setAudioUri(null);
  };

  const startRecording = async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        alert("Permission to access microphone is required!");
        return;
      }

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      await recording.startAsync();
      setRecording(recording);
    } catch (error) {
      console.error("Failed to start recording:", error);
    }
  };

  const stopRecording = async () => {
    try {
      await recording?.stopAndUnloadAsync();
      const uri = recording?.getURI() ?? null;
      setAudioUri(uri);
      setRecording(undefined);
    } catch (error) {
      console.error("Failed to stop recording:", error);
    }
  };

  const playAudio = async (uri: string) => {
    await playingSound?.stopAsync();
    await playingSound?.unloadAsync();
    setPlayingSound(null);

    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true }
      );

      setPlayingSound(sound);

      sound.setOnPlaybackStatusUpdate((status) => {
        if ("didJustFinish" in status && status.didJustFinish) {
          setPlayingSound(null);
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.error("Failed to play audio:", error);
    }
  };

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
          <FlatList
            data={chatList}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ paddingBottom: hp(15) }}
            renderItem={({ item }) => (
              <View
                style={{
                  flexDirection: item.sender === "me" ? "row-reverse" : "row",
                  padding: 10,
                  paddingVertical: item.sender === "me" ? 13 : 3,
                }}
              >
                <View style={{ maxWidth: "70%" }}>
                  <View
                    style={{
                      borderBottomRightRadius: item.sender === "me" ? 0 : 10,
                      borderBottomLeftRadius: item.sender === "me" ? 10 : 0,
                      backgroundColor: item.sender === "me" ? "#212121" : "#fe183c",
                      padding: 10,
                      borderRadius: 10,
                    }}
                  >
                    {item.message ? (
                      <Text className="text-white text-base leading-5">
                        {item.message}
                      </Text>
                    ) : null}
                    {item.images?.length > 0 &&
                      item.images.map((img: string, index: number) => (
                        <Image
                          key={index}
                          source={{ uri: img }}
                          style={{ width: 100, height: 100, marginTop: 5 }}
                        />
                      ))}
                    {item.audio && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onPress={() => playAudio(item.audio)}
                      >
                        <Text className="text-white">Play Audio</Text>
                      </Button>
                    )}
                  </View>
                  <Text
                    className={`text-xs font-semibold text-neutral-500 ${item.sender === "me" ? "text-right" : "text-left"
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
              imgs={imgs}
              setImgs={setImgs}
              triggerContent={
                <Button variant="ghost" size="icon">
                  <PhotoIcon size={hp(3)} color={"gray"} strokeWidth={2} />
                </Button>
              }
            />
            {recording ? (
              <Button variant="ghost" size="icon" onPress={stopRecording}>
                <MicrophoneIcon size={hp(3)} color="red" strokeWidth={2} />
              </Button>
            ) : (
              <Button variant="ghost" size="icon" onPress={startRecording}>
                <MicrophoneIcon size={hp(3)} color={"gray"} strokeWidth={2} />
              </Button>
            )}
          </View>
        </View>
        <Pressable onPress={sendMess} className="w-[12%] justify-center">
          <PaperAirplaneIcon size={hp(3.2)} color={"gray"} strokeWidth={2} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}