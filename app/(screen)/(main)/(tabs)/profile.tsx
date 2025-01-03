import { useState, useCallback, useEffect } from "react";
import { View, Image, ScrollView } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { Button } from "@/components/ui/button";
import { router } from "expo-router";
import { Pen } from "@/lib/icons";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/provider/AuthProvider";
import { supabase } from "@/supabase/supabase"; // Import supabase
import { useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect để reload dữ liệu

export default function ProfileScreen() {
  const { session } = useAuth();
  const [profile, setProfile] = useState<ProfileFormData | null>(null);

  const getProfile = useCallback(async () => {
    if (!session) return;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      setProfile(
        data || {
          first_name: "",
          last_name: "",
          username: "",
          email: "",
          phone: "",
          house_number: "",
          city: "",
          imgs: [],
        }
      );
    } catch (err) {
      console.error("Error fetching profile:", err);
      setProfile(null);
    }
  }, [session]);

  // Dùng useFocusEffect để reload dữ liệu mỗi khi quay lại trang ProfileScreen
  useFocusEffect(
    useCallback(() => {
      getProfile();
    }, [getProfile])
  );

  return (
    <ScrollView
      className="relative flex-1"
      contentContainerStyle={{
        paddingBottom: hp(5),
        alignItems: "center",
      }}
    >
      {/* Image */}
      <View className="relative m-3">
        <Image
          source={{
            uri:
              profile?.imgs?.[0] ||
              "https://img.freepik.com/premium-photo/close-up-smiling-confident-beautiful-brunette-girl-glasses-looking-happy_1258-19160.jpg",
          }}
          className="rounded-full size-40"
        />
        <Button
          className="rounded-full absolute -bottom-2 -right-2 p-6"
          variant="secondary"
          size="icon"
          onPress={() => router.push("/editProfile")}
        >
          <Pen className="text-zinc-500 dark:text-zinc-100" strokeWidth={1.5} />
        </Button>
      </View>

      <View className="w-full justify-center items-center flex-row">
        <Text className="text-black dark:text-white text-center font-bold text-xl">
          {profile?.first_name} {profile?.last_name}
        </Text>
      </View>

      <View className="w-full justify-start items-start px-6 space-y-4 mt-6">
        {/* User info */}
        <View className="flex flex-col mt-6">
          <Text className="text-zinc-800 dark:text-zinc-200 font-bold">
            User Name
          </Text>
          <Text className="text-black dark:text-white flex-row mt-3 flex-wrap gap-2">
            {profile?.username ?? "Chưa có tên"}
          </Text>
        </View>

        {/* User location */}
        <View className="flex flex-col mt-6">
          <Text className="text-zinc-800 dark:text-zinc-200 font-bold">
            Nơi sống
          </Text>
          <Text className="text-black dark:text-white flex-row mt-3 flex-wrap gap-2">
            {profile?.house_number}, {profile?.city ?? "Chưa có địa chỉ"}
          </Text>
        </View>

        {/* User contact info */}
        <View className="flex flex-col mt-6">
          <Text className="text-zinc-800 dark:text-zinc-200 font-bold">
            Liên hệ
          </Text>
          <Text className="text-black dark:text-white flex-row mt-3 flex-wrap gap-2">
            {profile?.phone ?? "Chưa có số điện thoại"}
          </Text>
        </View>

        <View className="flex flex-col mt-6">
          <Text className="text-zinc-800 dark:text-zinc-200 font-bold">
            Email
          </Text>
          <Text className="text-black dark:text-white flex-row mt-3 flex-wrap gap-2">
            {profile?.email ?? "Chưa có email"}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
