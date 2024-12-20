import React, { useCallback, useState } from "react";
import * as FileSystem from "expo-file-system";
import { Dimensions, Image, ScrollView, View } from "react-native";
import { Slider, RangeSlider } from "@sharcoux/slider";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Pressable } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Smile, X } from "@/lib/icons";
import Carousel from "@/components/carousel/type1";
import ImageUploadType1 from "@/components/imageUpload/type1";
import { Plus } from "@/lib/icons";
import {
  Colors,
  SegmentedControl,
  SegmentedControlItemProps,
  TextField,
} from "react-native-ui-lib";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SingleChoicePicker from "@/components/select/oneChoice";
import { useColorScheme } from "nativewind";
import { fbApp } from "@/firebase/config";

console.log(fbApp)

const { width, height } = Dimensions.get("window");

const segments: Record<string, Array<SegmentedControlItemProps>> = {
  first: [{ label: "Hình ảnh" }, { label: "Xem trước" }],
};

const optionsGender = [
  { label: "Nam", value: "male" },
  { label: "Nữ", value: "female" },
  { label: "Khác", value: "other" },
];

export default function FilterScreen() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const [name, setName] = useState("");
  const [gender, setGender] = useState("male");
  const [age, setAge] = useState(null);
  const [bio, setBio] = useState("");
  const [imgs, setImgs] = useState<string[]>([]);
  const [tab, setTab] = useState(0);

  const onChangeIndex = useCallback((index: number) => {
    console.warn(
      "Index " + index + " of the second segmentedControl was pressed"
    );
    setTab(index);
  }, []);
  const [screenPreset, setScreenPreset] = useState(
    SegmentedControl.presets.DEFAULT
  );

  const submitHandler = async () => {
    try {
      console.log("imgs", imgs)
      const imgsFirebase = await uploadImages(imgs);
      console.log("imgsFirebase", imgsFirebase)

      // 2. Chuẩn bị dữ liệu người dùng
      const userData = {
        name,
        age,
        bio,
        gender,
        imgsFirebase,
      };

      // console.log("fetch dữ liệu", userData)

      // // 3. Gửi dữ liệu đến API khác
      // const response = await fetch("http://<YOUR_NEXTJS_SERVER>/api/user/create", {
      //   method: "POST",
      //   body: JSON.stringify(userData),
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // });

      // const data = await response.json();
      // if (!response.ok) {
      //   throw new Error(data.error || "Failed to save user data!");
      // }

      // console.log("User data saved successfully:", data);
    } catch (error) {
      // console.error("Error submitting data:", error.message);
    }
  };

  const CustomThumb = () => {
    return (
      <View className="!size-6 rounded-full shadow-2xl shadow-pri-color border-3 border-zinc-100 dark:border-zinc-900 bg-zinc-50 dark:bg-white">
        <Text></Text>
      </View>
    );
  };

  const onDelete = (indexToRemove: number) => {
    setImgs((prevImgs) =>
      prevImgs.filter((_, index) => index !== indexToRemove)
    );
  };

  return (
    <ScrollView className="flex-1">
      <View className="h-full p-4 gap-4 flex flex-col mb-16">
        <TextField
          label="Tên của bạn"
          labelStyle={{
            fontSize: 16,
            color: colorScheme === "dark" ? "white" : "black",
            fontWeight: 800,
            paddingVertical: 3,
            paddingHorizontal: 12,
          }}
          placeholder={"Nhập tên của bạn"}
          placeholderTextColor="gray"
          floatingPlaceholderStyle={{
            fontSize: 16,
            color: colorScheme === "dark" ? "white" : "black",
            fontWeight: 800,
            paddingBottom: 2,
          }}
          color={colorScheme === "dark" ? "white" : "black"}
          // floatingPlaceholder
          // floatOnFocus
          enableErrors
          validateOnChange
          validate={["required"]}
          validationMessage={["Tên không được để trống"]}
          validationMessageStyle={{
            fontSize: 12,
            paddingVertical: 3,
            paddingHorizontal: 12,
          }}
          // showCharCounter
          maxLength={30}
          containerStyle={{
            width: "100%",
          }}
          fieldStyle={{
            backgroundColor: colorScheme === "dark" ? "#18181b" : "#f4f4f5",
            paddingVertical: 16,
            paddingHorizontal: 16,
            borderRadius: 999,
            borderWidth: 2,
            borderColor: colorScheme === "dark" ? "#27272a" : "#e4e4e7",
          }}
          value={name}
          onChangeText={setName}
        />

        <View className="flex flex-row gap-6">
          <View className="flex-1 ">
            <Text className="pl-4 text-black dark:text-white font-bold text-lg mb-1">
              Giới tính
            </Text>
            <View className="px-6 py-4 flex justify-start items-start bg-zinc-100 dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-full">
              <SingleChoicePicker
                value={gender}
                onChange={setGender} // Ensure this matches the correct type
                title="Chọn một"
                placeholder="Chọn một giá trị"
                options={optionsGender}
                useDialogDefault
              />
            </View>
          </View>

          <TextField
            keyboardType="numeric"
            label="Tuổi"
            labelStyle={{
              fontSize: 16,
              color: colorScheme === "dark" ? "white" : "black",
              fontWeight: 800,
              paddingVertical: 3,
              paddingHorizontal: 12,
            }}
            placeholder={"Tuổi"}
            placeholderTextColor="gray"
            floatingPlaceholderStyle={{
              fontSize: 16,
              color: colorScheme === "dark" ? "white" : "black",
              fontWeight: 800,
              paddingBottom: 2,
            }}
            color={colorScheme === "dark" ? "white" : "black"}
            // floatingPlaceholder
            // floatOnFocus
            value={age}
            onChangeText={setAge}
            enableErrors
            validateOnChange
            validate={[
              "required",
              (value) => value >= 18,
              (value) => value <= 100,
            ]}
            validationMessage={[
              "Tuổi không được để trống",
              "Tuổi phải lớn hơn 18",
              "Tuổi phải nhỏ hơn 100",
            ]}
            validationMessageStyle={{
              fontSize: 12,
              paddingVertical: 3,
              paddingHorizontal: 12,
            }}
            // showCharCounter
            maxLength={30}
            containerStyle={{
              flex: 1,
            }}
            fieldStyle={{
              backgroundColor: colorScheme === "dark" ? "#18181b" : "#f4f4f5",
              paddingVertical: 16,
              paddingHorizontal: 16,
              borderRadius: 999,
              borderWidth: 2,
              borderColor: colorScheme === "dark" ? "#27272a" : "#e4e4e7",
            }}
          />
        </View>

        <TextField
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          label="Giới thiệu bạn với mọi người"
          labelStyle={{
            fontSize: 16,
            color: colorScheme === "dark" ? "white" : "black",
            fontWeight: 800,
            paddingVertical: 3,
            paddingHorizontal: 12,
          }}
          placeholder={"Viết gì đó giới thiệu bạn với mọi người"}
          placeholderTextColor="gray"
          floatingPlaceholderStyle={{
            fontSize: 16,
            color: colorScheme === "dark" ? "white" : "black",
            fontWeight: 800,
            paddingBottom: 2,
          }}
          color={colorScheme === "dark" ? "white" : "black"}
          // floatingPlaceholder
          // floatOnFocus
          onChangeText={(text) => console.log(text)}
          enableErrors
          validateOnChange
          // validate={["required"]}
          // validationMessage={["Tên không được để trống"]}
          validationMessageStyle={{
            fontSize: 12,
            paddingVertical: 3,
            paddingHorizontal: 12,
          }}
          showCharCounter
          charCounterStyle={{
            paddingHorizontal: 12,
          }}
          maxLength={200}
          containerStyle={{
            width: "100%",
          }}
          fieldStyle={{
            height: 100,
            backgroundColor: colorScheme === "dark" ? "#18181b" : "#f4f4f5",
            paddingVertical: 16,
            paddingHorizontal: 12,
            borderRadius: 16,
            borderWidth: 2,
            borderColor: colorScheme === "dark" ? "#27272a" : "#e4e4e7",
          }}
        />

        <SegmentedControl
          style={{
            borderColor: colorScheme === "dark" ? "#27272a" : "#d4d4d8",
          }}
          inactiveColor="gray"
          backgroundColor={colorScheme === "dark" ? "black" : "#e4e4e7"}
          activeColor={Colors.$textDangerLight}
          activeBackgroundColor={colorScheme === "dark" ? "#18181b" : "white"}
          outlineColor={Colors.$textDangerLight}
          segments={segments.first}
          preset={screenPreset}
          onChangeIndex={onChangeIndex}
        />

        {tab === 0 ? (
          <View className="flex flex-row flex-wrap gap-2 justify-between items-center">
            {Array(9)
              .fill(0)
              .map((_, index) => (
                <View
                  key={index}
                  className="w-[30%] aspect-[3/4] rounded-lg overflow-hidden border-2 border-pri-color"
                >
                  {!imgs[index] ? (
                    <ImageUploadType1
                      imgs={imgs}
                      setImgs={setImgs}
                      triggerContent={
                        <Button
                          size="icon"
                          variant="none"
                          className="bg-pri-color rounded-md"
                        >
                          <Plus className="size-12 text-white" />
                        </Button>
                      }
                    />
                  ) : (
                    <View className="h-full w-full relative ">
                      <Image
                        source={{ uri: imgs[index] }}
                        className="h-full w-full object-cover rounded-lg aspect-[3/4]"
                      />
                      <Button
                        size="icon"
                        variant="secondary"
                        className="rounded-full absolute top-1 right-1 size-8"
                        onPress={() => onDelete(index)}
                      >
                        <X className="size-6 text-zinc-900 dark:text-zinc-300" />
                      </Button>
                    </View>
                  )}
                </View>
              ))}
          </View>
        ) : imgs.length <= 0 ? (
          <View className="w-full aspect-[3/4] flex flex-row justify-center items-center bg-zinc-100 dark:bg-zinc-900 rounded-lg">
            <Text className="text-center">Không có ảnh để hiển thị</Text>
          </View>
        ) : (
          <Carousel data={imgs}>
            {(item) => (
              <Image
                source={{ uri: item }}
                className="w-full h-full rounded-lg aspect-[3/4]"
                style={{ width: width }}
              />
            )}
          </Carousel>
        )}

        {/* Nút Submit */}

        <Button onPress={submitHandler} className="mt-4 rounded-full">
          <Text>Lưu</Text>
        </Button>
      </View>
    </ScrollView>
  );
}
