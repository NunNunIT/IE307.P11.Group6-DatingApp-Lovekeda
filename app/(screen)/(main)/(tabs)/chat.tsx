// import { SafeAreaView } from "react-native-safe-area-context";
// import { heightPercentageToDP as hp } from "react-native-responsive-screen";
// import { CHAT_DATA } from "@/constant";
// import { Input } from "@/components/ui/input";
// import { Search } from "@/lib/icons";
// import { router } from "expo-router";
// import Matches from "@/components/card/matches";

// import React, {
//   useState,
//   useLayoutEffect,
//   useEffect,
//   useCallback,
// } from "react";
// import {
//   ActivityIndicator,
//   Image,
//   Platform,
//   Text,
//   TouchableOpacity,
//   View,
//   ScrollView,
// } from "react-native";
// import { GiftedChat } from "react-native-gifted-chat";
// import {
//   collection,
//   addDoc,
//   orderBy,
//   query,
//   where,
//   onSnapshot,
// } from "firebase/firestore";
// import { signOut } from "firebase/auth";
// import { auth, database } from "@/config/firebase";
// import { useNavigation } from "@react-navigation/native";
// import { AntDesign } from "@expo/vector-icons";
// import colors from "@/config/colors";
// import { useAuth } from "@/provider/AuthProvider";
// import { useLocalSearchParams } from "expo-router";
// import ImageUploadType1 from "@/components/imageUpload/type1";
// import { Button } from "@/components/ui/button";

// const ChatItem = ({ item, onPress }: { item: any; onPress: any }) => (
//   <TouchableOpacity
//     onPress={onPress}
//     className="w-full py-2 items-center flex-row border-b border-zinc-300 dark:border-zinc-600 px-4"
//   >
//     {/* Avatar */}
//     <View
//       className="w-[17%] justify-center"
//       style={{
//         width: hp(7),
//         height: hp(7),
//       }}
//     >
//       <Image
//         source={item.imgUrl}
//         style={{
//           width: "90%",
//           height: "90%",
//         }}
//         className="rounded-full"
//       />
//     </View>

//     {/* Information */}
//     <View className="w-[82%]" style={{ height: hp(6) }}>
//       <View className="flex-row justify-between items-center">
//         <View className="flex-row justify-center">
//           <View className="flex-row">
//             <Text className="font-bold text-base text-black dark:text-white">
//               {item.name}
//             </Text>
//           </View>
//           {item.isOnline && (
//             <View className="justify-center items-center">
//               <View className="w-2 h-2 bg-teal-500 rounded-full ml-1 justify-center items-center"></View>
//             </View>
//           )}
//         </View>
//         <Text className="text-sm text-zinc-800 dark:text-zinc-300 tracking-tight">
//           {item.timeSent}
//         </Text>
//       </View>
//       <View>
//         <Text className="font-semibold text-xs text-zinc-500 dark:text-zinc-400">
//           {item.lastMessage.length > 45
//             ? item.lastMessage.slice(0, 45) + "..."
//             : item.lastMessage}
//         </Text>
//       </View>
//     </View>
//   </TouchableOpacity>
// );

// export default function ChatScreen() {
//   const [isLoading, setIsLoading] = useState<boolean>(true); // Trạng thái tải dữ liệu
//   const { session } = useAuth();
//   const [chatRoom, setChatRoom] = useState([]);
//   const me = session?.user?.id; // Current user id

//   useEffect(() => {
//     // Giả lập thời gian tải dữ liệu
//     const timeout = setTimeout(() => {
//       setIsLoading(false);
//     }, 2000); // 2 giây

//     return () => clearTimeout(timeout); // Xóa timeout khi component unmount
//   }, []);

//   // Fetch messages
//   useLayoutEffect(() => {
//     const collectionRef = collection(database, "chats");

//     const q = query(
//       collectionRef,
//       where("sender", "==", me),
//       where("receiver", "==", me),
//       orderBy("createdAt", "desc")
//     );

//     const unsubscribe = onSnapshot(q, (querySnapshot) => {
//       return setChatRoom(
//         querySnapshot.docs.map((doc) => ({
//           _id: doc.data()._id,
//           createdAt: doc.data().createdAt.toDate(),
//           text: doc.data().text,
//           image: doc.data().image || null, // Handle image messages
//           sender: doc.data().sender,
//           receiver: doc.data().receiver,
//           user: doc.data().user,
//         }))
//       );
//       setIsLoading(false); // Ngừng trạng thái tải khi dữ liệu đã sẵn sàng
//     });

//     return unsubscribe;
//   }, [me]);

//   return (
//     <View className="flex-1 bg-white dark:bg-black py-4">
//       {/* Matches Component */}
//       <Matches />

//       {/* Search Bar */}
//       <View className="my-2 px-4">
//         <Input
//           placeholder="Search"
//           placeholderTextColor={"gray"}
//           className="rounded-full"
//           startIcon={
//             <Search className="size-6 ml-2 text-zinc-500 dark:text-zinc-600" />
//           }
//         />
//       </View>

//       {/* Chat List */}
//       <Text className="uppercase font-semibold text-zinc-500 tracking-wider py-2 px-4">
//         Trò chuyện
//       </Text>
//       {isLoading ? (
//         <View className="flex-1 justify-center items-center px-4">
//           <ActivityIndicator size="large" color="#fe183c" />
//           <Text className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
//             Đang tải danh sách...
//           </Text>
//         </View>
//       ) : (
//         <ScrollView
//           className="flex-1"
//           contentContainerStyle={{
//             paddingBottom: hp(5),
//           }}
//         >
//           <View>
//             {chatRoom.map((item) => (
//               <ChatItem
//                 key={item.id}
//                 item={item}
//                 onPress={() => router.push(`/chatDetail/${reciever != me ? reciever : sender }`)}
//               />
//             ))}
//           </View>
//         </ScrollView>
//       )}
//     </View>
//   );
// }

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
import { database } from "@/config/firebase";
import colors from "@/config/colors";
import { DATE_DATA } from "@/constant";

const ChatItem = ({ item, onPress }: { item: any; onPress: any }) => (
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
        source={{ uri: item.imgs[0] }}
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
              <View className="w-2 h-2 bg-teal-500 rounded-full ml-1"></View>
            </View>
          )}
        </View>
        <Text className="text-sm text-zinc-800 dark:text-zinc-300 tracking-tight">
          {item.timeSent}
        </Text>
      </View>
      <View>
        <Text className="font-semibold text-xs text-zinc-500 dark:text-zinc-400">
          {item.lastMessage
            ? item.lastMessage.length > 45
              ? item.lastMessage.slice(0, 45) + "..."
              : item.lastMessage
            : "No messages yet."}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

export default function ChatScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [chatRoom, setChatRoom] = useState([]);
  const { session } = useAuth();
  const me = session?.user?.id;

  useLayoutEffect(() => {
    const collectionRef = collection(database, "chats");
    const q = query(
      collectionRef,
      where("participants", "array-contains", me), // Fetch all chats involving the current user
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const chats = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setChatRoom(chats);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching chat rooms: ", error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [me]);

  // console.log(chatRoom);

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
          {filteredData.slice(0, 3).map((item) => (
            <ChatItem
              key={item.user_id}
              item={item}
              // onPress={() =>
              //   router.push(
              //     `/chatDetail/${
              //       item.receiver !== me ? item.receiver : item.sender
              //     }`
              //   )
              // }
              onPress={() => router.push(`/chatDetail/${item.id}`)}
            />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
