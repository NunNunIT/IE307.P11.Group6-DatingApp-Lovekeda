import React from "react";
import { ScrollView, View } from "react-native";
import { Slider, RangeSlider } from "@sharcoux/slider";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Pressable } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Smile } from "@/lib/icons"

export default function FilterScreen() {
  const [rangeAge, setRangeAge] = React.useState<[number, number]>([18, 100]);
  const [valueDistance, setValueDistance] = React.useState<number>(10);
  const [purposeValue, setPurposeValue] = React.useState<string>("friends");
  const [genderValue, setGenderValue] = React.useState<string>("all");

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

  return (
    <ScrollView className="flex-1">
      <View className="h-full p-4 gap-4 flex flex-col mb-16">
        {/* Độ tuổi */}
        <View className="relative flex flex-col justify-between gap-6 rounded-lg bg-white dark:bg-zinc-900 shadow p-6">
          <View className="flex flex-row justify-between">
            <Text className="text-lg font-bold">Độ tuổi</Text>
            <Text className="text-lg text-zinc-800 dark:text-zinc-300">
              {rangeAge[0]} - {rangeAge[1]}
            </Text>
          </View>
          <RangeSlider
            onValueChange={setRangeAge}
            range={rangeAge}
            step={1}
            minimumValue={18}
            maximumValue={80}
            CustomThumb={CustomThumb}
            inboundColor="#fe183c"
          />
        </View>

        {/* Khoảng cách */}
        <View className="relative flex flex-col justify-between gap-6 rounded-lg bg-white dark:bg-zinc-900 shadow p-6">
          <View className="flex flex-row justify-between">
            <Text className="text-lg font-bold">Khoảng cách (km)</Text>
            <Text className="text-lg text-zinc-800 dark:text-zinc-300">
              {valueDistance} km
            </Text>
          </View>
          <Slider
            onValueChange={setValueDistance}
            value={valueDistance}
            step={1}
            minimumValue={1}
            maximumValue={50}
            CustomThumb={CustomThumb}
            minimumTrackTintColor="#fe183c"
          />
        </View>

        {/* Mục đích tìm kiếm */}
        <View className="relative flex flex-col rounded-lg gap-6 bg-white dark:bg-zinc-900 shadow p-6">
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

        {/* Giới tính */}
        <View className="relative flex flex-col rounded-lg gap-6 bg-white dark:bg-zinc-900 shadow p-6">
          <Text className="text-lg font-bold">Đang tìm kiếm</Text>
          <View className="flex flex-row gap-2">
            {["female", "male", "all"].map((gender) => (
              <Pressable
                key={gender}
                className={`h-24 w-full flex-1 flex flex-col justify-center items-center rounded-lg border-2 ${
                  genderValue === gender
                    ? "border-pri-color bg-white dark:bg-zinc-950"
                    : "border-zinc-200 dark:border-zinc-800"
                }`}
                onPress={() => setGenderValue(gender)}
              >
                {gender === "female" ? (
                  <Icon name="venus" size={32} color={"#fe183c"} />
                ) : gender === "male" ? (
                  <Icon name="mars" size={32} color={"#0ea5e9"} />
                ) : (
                  <Smile className="size-6 text-yellow-400" />
                )}
                <Text>
                  {gender === "female"
                    ? "Nữ"
                    : gender === "male"
                    ? "Nam"
                    : "Tất cả"}
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
