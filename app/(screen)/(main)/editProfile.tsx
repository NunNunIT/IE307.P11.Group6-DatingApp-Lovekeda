import React, { useCallback, useEffect, useState } from "react";
import { Dimensions, Image, ScrollView, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { X } from "@/lib/icons";
import Carousel from "@/components/carousel/type1";
import ImageUploadType1 from "@/components/imageUpload/type1";
import { Plus } from "@/lib/icons";
import {
  Colors,
  SegmentedControl,
  SegmentedControlItemProps,
  TextField,
} from "react-native-ui-lib";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
import SingleChoicePicker from "@/components/select/oneChoice";
import { useColorScheme } from "nativewind";
import { useAuth } from "@/provider/AuthProvider";
import { supabase } from "@/utils/supabase";
import { router } from "expo-router";
import Spinner from "react-native-loading-spinner-overlay";
import { bindAll } from "lodash";
import { fbApp, uploadToFireBase } from "@/firebase/config";
import MultiChoicePicker from "@/components/select/multiChoice";
import { GENDER_OPTIONS } from "../(set-up-profile)";

// console.log(fbApp)

const { width } = Dimensions.get("window");

const segments: Record<string, Array<SegmentedControlItemProps>> = {
  first: [{ label: "Hình ảnh" }, { label: "Xem trước" }],
};

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

export default function FilterScreen() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const { session, profile, getProfile } = useAuth();
  const [name, setName] = useState<string>(profile?.name ?? "");
  const [gender, setGender] = useState<string>(profile?.gender ?? "other");
  const [age, setAge] = useState<string>(profile?.age?.toString() ?? "");
  const [bio, setBio] = useState<string>(profile?.bio ?? "");
  const [imgs, setImgs] = useState<string[]>([]);
  const [tab, setTab] = useState(0);
  const [hobbies, setHobbies] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirtyFields, setIsDirtyFields] = useState(false);

  useEffect(() => {
    const isDirty =
      JSON.stringify({ name, gender, age, bio, imgs })
      !== JSON.stringify({
        name: profile?.name,
        gender: profile?.gender,
        age: profile?.age?.toString(),
        bio: profile?.bio,
        imgs: profile?.imgs,
      });
    setIsDirtyFields(isDirty);
  }, [profile, setIsDirtyFields, name, gender, bio, age, bindAll, imgs]);

  useEffect(() => {
    if (!profile) return;
    setName(profile?.name ?? "");
    setGender(profile?.gender ?? "other");
    setAge(profile?.age?.toString() ?? "");
    setBio(profile?.bio ?? "");
    setImgs(profile?.imgs ?? []);
  }, [profile])

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
    if (!session) return;
    setIsSubmitting(true);
    try {
      // console.log("imgs", imgs)
      // const imgsFirebase = await uploadToFireBase(imgs[0], "haha");
      // console.log("imgsFirebase", imgsFirebase)

      // 2. Chuẩn bị dữ liệu người dùng
      const userData = {
        name,
        age: Number(age),
        bio,
        gender,
        imgs: imgs, // imgsFirebase
        user_id: session.user.id,
      };

      await supabase.from("profiles").upsert(userData, { onConflict: "user_id" });
      await getProfile?.();
      setIsSubmitting(false);
      router.back();
    } catch (error) {
      // console.error("Error submitting data:", error.message);
    } finally {
      setIsSubmitting(false);
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
                onChange={(value) => setGender(value as string)} // Ensure this matches the correct type
                title="Chọn một"
                placeholder="Chọn một giá trị"
                options={[...GENDER_OPTIONS]}
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
              (value) => Number(value) >= 18,
              (value) => Number(value) <= 100,
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
          value={bio}
          onChangeText={setBio}
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


        <MultiChoicePicker
          values={hobbies}
          onChange={(value) => setHobbies(value.map(item => item.toString()))} // Ensure this matches the correct type
          title="Sở thích"
          placeholder="Chọn nhiều giá trị"
          options={options}
          showSearch
        // useDialogDefault
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
        <Button onPress={submitHandler} className="mt-4 rounded-full" disabled={!isDirtyFields || isSubmitting} variant="red">
          <Text>Lưu</Text>
        </Button>
      </View>
    </ScrollView>
  );
}
