import { View, Image, ScrollView } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { Button } from "@/components/ui/button";
import { router } from "expo-router";
import { Pen } from "@/lib/icons";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/provider/AuthProvider";
import { HOBBY_OPTIONS } from "../editProfile";

export default function ProfileScreen() {
  const { profile } = useAuth();

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
          source={{ uri: profile?.imgs?.[0] }}
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
          {profile?.name}
          {", "}
        </Text>
        <Text className="text-black dark:text-white text-center font-bold text-xl ">
          {profile?.age}
        </Text>
      </View>

      <View className="w-full justify-start items-start px-6 space-y-4 mt-6">
        {/* User Bio */}
        <Text className="text-black dark:text-white text-left font-medium text-sm">
          {profile?.bio ? profile.bio : "Chưa có bio"}
        </Text>

        {/* User location */}
        <View className="flex flex-col mt-6">
          <Text className="text-zinc-800 dark:text-zinc-200 font-bold">
            Nơi sống
          </Text>
          <Text className="text-black dark:text-white flex-row mt-3 flex-wrap gap-2">
            {profile?.display_address ?? "Phường Đông Hòa, Thành phố Dĩ An, Tỉnh Bình Dương, Việt Nam"}
          </Text>
        </View>

        {/* User hobbies */}
        <View className="flex flex-col mt-6">
          <Text className="text-zinc-800 dark:text-zinc-200 font-bold">
            Sở thích
          </Text>
          <View className="flex-row mt-3 flex-wrap gap-2">
            {profile?.hobbies?.map((hobby, index) => (
              <View key={index} className="bg-pri-color rounded-3xl p-1 px-3">
                {/* <Text className="text-white dark:text-white">{HOBBY_OPTIONS.find(item => item.value === hobby)?.label}</Text> */}
                <Text className="text-white dark:text-white">
                  {HOBBY_OPTIONS.find((item) => item.value === hobby)?.label}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* <MultiChoicePicker
        values={values}
        onChange={setValues} // Ensure this matches the correct type
        title="Chọn nhiều"
        placeholder="Chọn nhiều giá trị"
        options={options}
        showSearch
        // useDialogDefault
      />

      <SingleChoicePicker
        value={value}
        onChange={setValue} // Ensure this matches the correct type
        title="Chọn một"
        placeholder="Chọn một giá trị"
        options={options}
        showSearch
      /> */}
    </ScrollView>
  );
}
