import React, { useCallback, useState } from "react";
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
} from "react-native-ui-lib";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SingleChoicePicker from "@/components/select/oneChoice";

const { width, height } = Dimensions.get("window");

const segments: Record<string, Array<SegmentedControlItemProps>> = {
  first: [{ label: "Hình ảnh" }, { label: "Xem trước" }],
};

const optionsGender = [
  { label: "Nam", value: "male" },
  { label: "Nữ", value: "female" },
  { label: "Khác", value: "Other" },
];

export default function FilterScreen() {
  const [rangeAge, setRangeAge] = React.useState<[number, number]>([18, 100]);
  const [valueDistance, setValueDistance] = React.useState<number>(10);
  const [purposeValue, setPurposeValue] = React.useState<string>("friends");
  const [genderValue, setGenderValue] = React.useState<string>("all");
  const [value, setValue] = useState(0);
  const [gender, setGender] = useState("female");
  const [imgs, setImgs] = useState<string[]>([]);

  const onChangeIndex = useCallback((index: number) => {
    console.warn(
      "Index " + index + " of the second segmentedControl was pressed"
    );
    setValue(index);
  }, []);
  const [screenPreset, setScreenPreset] = useState(
    SegmentedControl.presets.DEFAULT
  );

  const submitHandler = () => {
    const data = {
      ageRange: rangeAge,
      distance: valueDistance,
      gender: genderValue,
      purpose: purposeValue,
    };
    console.log("Data submitted:", data);
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
        <View className="relative flex flex-col rounded-lg gap-6 bg-white dark:bg-zinc-900 shadow p-3">
          <Text className="text-lg font-bold">Tên</Text>
          <Input
            autoCapitalize="characters"
            className=""
            placeholder="Nhập tên của bạn"
          />
        </View>

        <View className="relative flex flex-col rounded-lg gap-6 bg-white dark:bg-zinc-900 shadow p-3">
          <Text className="text-lg font-bold">Mô tả</Text>
          <Textarea
            placeholder="Để lại lời giới thiệu cho mọi người..."
            // value={value}
            // onChangeText={setValue}
            aria-labelledby="textareaLabel"
          />
        </View>

        <View className="flex flex-row gap-2">
          <View className="flex-1 relative flex flex-col rounded-lg gap-6 bg-white dark:bg-zinc-900 shadow p-3">
            <Text className="text-lg font-bold">Tuổi</Text>
            <Input
              autoCapitalize="characters"
              keyboardType="numeric"
              className=""
              placeholder="Nhập tuổi"
            />
          </View>
          {/* Giới tính */}
          <View className="flex-1 relative flex flex-col rounded-lg gap-6 bg-white dark:bg-zinc-900 shadow p-3">
            <Text className="text-lg font-bold">Giới tính</Text>
            <View className="flex flex-row gap-2 bg-zinc-50 dark:bg-zinc-900">
              <SingleChoicePicker
                value={gender}
                onChange={setGender} // Ensure this matches the correct type
                // title="Giới tính"
                placeholder="Chọn giới tính"
                options={optionsGender}
                showSearch
                useDialogDefault
              />
            </View>
          </View>
        </View>

        <SegmentedControl
          containerStyle={{}}
          activeColor={Colors.$textDangerLight}
          outlineColor={Colors.$textDangerLight}
          segments={segments.first}
          preset={screenPreset}
          onChangeIndex={onChangeIndex}
        />

        {value === 0 ? (
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

        {/* Mục đích tìm kiếm */}
        <View className="relative flex flex-col rounded-lg gap-6 bg-white dark:bg-zinc-900 shadow p-3">
          <Text className="text-lg font-bold">Mục đích tìm kiếm</Text>
          <View className="flex flex-row gap-2">
            {["friends", "dating"].map((purpose) => (
              <Pressable
                key={purpose}
                className={`h-24 w-full flex-1 flex flex-col justify-center items-center rounded-lg border-2 ${
                  purposeValue === purpose
                    ? "border-pri-color bg-white dark:bg-zinc-950"
                    : "border-zinc-200 dark:border-zinc-800"
                }`}
                onPress={() => setPurposeValue(purpose)}
              >
                <Text className="text-2xl">
                  {purpose === "friends" ? "👋" : "❤️"}
                </Text>
                <Text className="">
                  {purpose === "friends" ? "Tìm bạn" : "Tìm người yêu"}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Nút Submit */}
        <Button onPress={submitHandler} className="mt-4">
          <Text>Submit</Text>
        </Button>
      </View>
    </ScrollView>
  );
}
