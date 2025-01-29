import { useCallback, useEffect, useState } from "react";
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
import SingleChoicePicker from "@/components/select/oneChoice";
import { useColorScheme } from "nativewind";
import { useAuth } from "@/providers/AuthProvider";
import { router } from "expo-router";
import { bindAll } from "lodash";
import MultiChoicePicker from "@/components/select/multiChoice";
import { GENDER_OPTIONS, HOBBY_OPTIONS } from "@/constants/common";
import { customizeFetch } from "@/lib/functions";

const { width } = Dimensions.get("window");

const segments: Record<string, Array<SegmentedControlItemProps>> = {
  first: [{ label: "Hình ảnh" }, { label: "Xem trước" }],
};

export default function FilterScreen() {
  const { colorScheme } = useColorScheme();
  const { profile, getProfile } = useAuth();
  const [name, setName] = useState<string>(profile?.name ?? "");
  const [gender, setGender] = useState<string>(profile?.gender ?? "other");
  const [age, setAge] = useState<string>(profile?.age?.toString() ?? "");
  const [bio, setBio] = useState<string>(profile?.bio ?? "");
  const [imgs, setImgs] = useState<string[]>([]);
  const [tab, setTab] = useState(0);
  const [hobbies, setHobbies] = useState<string[]>(profile?.hobbies ?? []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirtyFields, setIsDirtyFields] = useState(false);

  useEffect(() => {
    const isDirty =
      JSON.stringify({ name, gender, age, bio, imgs, hobbies }) !==
      JSON.stringify({
        name: profile?.name,
        gender: profile?.gender,
        age: profile?.age?.toString(),
        bio: profile?.bio,
        imgs: profile?.imgs,
        hobbies: profile?.hobbies,
      });
    setIsDirtyFields(isDirty);
  }, [
    profile,
    setIsDirtyFields,
    name,
    gender,
    bio,
    age,
    bindAll,
    imgs,
    hobbies,
  ]);

  useEffect(() => {
    if (!profile) return;
    setName(profile?.name ?? "");
    setGender(profile?.gender ?? "other");
    setAge(profile?.age?.toString() ?? "");
    setBio(profile?.bio ?? "");
    setImgs(profile?.imgs ?? []);
    setHobbies(profile?.hobbies ?? []);
  }, [profile]);

  const onChangeIndex = useCallback((index: number) => {
    setTab(index);
  }, []);

  const [screenPreset] = useState(
    SegmentedControl.presets.DEFAULT
  );

  const submitHandler = useCallback(async () => {
    if (!profile) return;
    setIsSubmitting(true);
    try {
      const userData = {
        name,
        age: Number(age),
        bio,
        gender,
        imgs,
        hobbies,
      };

      await customizeFetch(`/users/${profile.user_id}`, {
        method: "PATCH",
        body: JSON.stringify(userData),
      });

      await getProfile();
      setIsSubmitting(false);
      router.replace("/(screen)/(main)/(tabs)/profile");
    } catch (error) {
      // console.error("Error submitting data:", error.message);
    } finally {
      setIsSubmitting(false);
    }
  }, [profile, name, age, bio, gender, imgs, hobbies, getProfile]);

  const onDelete = (indexToRemove: number) => {
    setImgs((prevImgs) =>
      prevImgs.filter((_, index) => index !== indexToRemove)
    );
  };

  return (
    <View className="flex-1">
      <ScrollView className="flex-5">
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

          <View className="flex flex-row justify-between">
            <MultiChoicePicker
              values={hobbies}
              onChange={(value) =>
                setHobbies(value.map((item) => item.toString()))
              }
              title="Sở thích"
              placeholder="Chọn nhiều giá trị"
              options={[...HOBBY_OPTIONS]}
              showSearch
              // useDialogDefault
            />
          </View>

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
        </View>
      </ScrollView>
      {/* Nút Submit */}
      <Button
        onPress={submitHandler}
        className="m-4 rounded-full z-50"
        disabled={!isDirtyFields || isSubmitting}
        variant="red"
      >
        <Text>Lưu</Text>
      </Button>
    </View>
  );
}
