import {
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { profileData } from "@/constant";
import DarkModeSwitch from "@/components/darkModeOption/switch";
import { Button } from "@/components/ui/button";
import { router } from "expo-router";
import { Pen } from "@/lib/icons";
import { Text } from "@/components/ui/text";
import ImageUploadType1 from "@/components/imageUpload/type1";
import Carousel from "@/components/carousel/type1";
import { Plus } from "@/lib/icons";
import MultiChoicePicker from "@/components/select/multiChoice";
import SingleChoicePicker from "@/components/select/oneChoice";
var { width, height } = Dimensions.get("window");

const options = [
  { label: "JavaScript", value: "js" },
  { label: "Java", value: "java" },
  { label: "Python1", value: "python1" },
  { label: "Python2", value: "python2" },
  { label: "Python3", value: "python3" },
  { label: "Python4", value: "python4" },
  { label: "C++", value: "c++", disabled: true },
  { label: "C++", value: "c++", disabled: true },
  { label: "C++", value: "c++", disabled: true },
  { label: "C++", value: "c++", disabled: true },
  { label: "C++", value: "c++", disabled: true },
  { label: "C++", value: "c++", disabled: true },
  { label: "C++", value: "c++", disabled: true },
  { label: "C++", value: "c++", disabled: true },
  { label: "Perl1", value: "perl1" },
  { label: "Perl4", value: "perl4" },
  { label: "Perl3", value: "perl3" },
  { label: "Perl2", value: "perl2" },
  { label: "Perl", value: "perl" },
  { label: "Perl", value: "perl" },
  { label: "Perl", value: "perl" },
  { label: "Perl", value: "perl" },
  { label: "Perl", value: "perl" },
];

export default function ProfileScreen() {
  const data = profileData[0];
  const [values, setValues] = useState<string[]>(["perl2"]);
  const [value, setValue] = useState<string>();
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
        <Image source={{ uri: data.imgUrl }} className="rounded-full size-40" />
        <Button
          className="rounded-full absolute -bottom-2 -right-2 p-6"
          variant="secondary"
          size="icon"
        >
          <Pen className="text-zinc-500 dark:text-zinc-100" strokeWidth={1.5} />
        </Button>
      </View>

      {/* Bio */}
      <View className="w-full justify-start items-start px-6 space-y-4 mt-6">
        {/* User name and age */}
        <View className="flex-row space-x-2 justify-between w-full items-center">
          <View className="flex-row ">
            <Text className="text-black dark:text-white text-center font-bold text-xl">
              {data.name}
              {", "}
            </Text>
            <Text className="text-black dark:text-white text-center font-bold text-xl ">
              {data.age}
            </Text>
          </View>

          <Button size="icon" onPress={() => router.push("/editProfile")}>
            <Text>Edit</Text>
          </Button>
        </View>

        {/* User hobbies */}
        <View>
          <View className="flex-row">
            {data.hobbies?.map((hobby, index) => (
              <View key={index} className="bg-rose-500 rounded-3xl p-2 mr-2">
                <Text className="text-black dark:text-white ">{hobby}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* User Bio */}
        <View>
          <Text className="uppercase font-semibold text-neutral-500 tracking-wider mb-2 ">
            BIO
          </Text>

          <Text className="text-black dark:text-white/80 text-left font-medium text-sm">
            {data.bio}
          </Text>
        </View>

        <DarkModeSwitch />

        {/*  */}
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
