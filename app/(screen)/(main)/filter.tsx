import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { Slider, RangeSlider } from "@sharcoux/slider";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Pressable } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Smile } from "@/lib/icons"
import { useAuth } from "@/provider/AuthProvider";
import { cn } from "@/lib/utils";
import { supabase } from "@/utils/supabase";
import Spinner from "react-native-loading-spinner-overlay";
import { router } from "expo-router";
import { useDump } from "@/provider/DumpProvider";
import { SEARCH_GENDER_OPTIONS } from "@/constants/common";

export default function FilterScreen() {
  const [rangeAge, setRangeAge] = useState<[number, number]>([18, 30]);
  const [valueDistance, setValueDistance] = useState<number>(10);
  const [genderFind, setGenderFind] = useState<string>("");
  const [purposeValue, setPurposeValue] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isDirtyFields, setIsDirtyFields] = useState<boolean>(false);
  const { session, profile, getProfile } = useAuth();
  const { setValue } = useDump();

  const submitHandler = async () => {
    if (!session) return;
    setIsSubmitting(true);
    setValue((prev: any) => ({
      ...(prev ?? {}),
      filter: {
        ageRange: rangeAge,
        distance: valueDistance,
        genderFind,
        purposeValue,
      }
    }))
    const data = {
      genderFind,
      purposeValue,
      user_id: session.user.id,
    };

    try {
      await supabase.from("profiles")
        .upsert(data, { onConflict: "user_id" });
      await getProfile?.();
      router.back();
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const isDirty = JSON.stringify({
      ageRange: rangeAge,
      distance: valueDistance,
      genderFind: genderFind,
      purposeValue: purposeValue,
    }) !== JSON.stringify({
      ageRange: rangeAge,
      distance: valueDistance,
      genderFind: profile?.genderFind,
      purposeValue: profile?.purposeValue,
    });
    setIsDirtyFields(isDirty);
  }, [profile, setIsDirtyFields, rangeAge, valueDistance, genderFind, purposeValue]);

  useEffect(() => {
    if (!profile) return;
    setGenderFind(profile?.genderFind ?? "all");
    setPurposeValue(profile?.purposeValue ?? "friends");
  }, [profile])

  const CustomThumb = () => {
    return (
      <View className={cn(
        "!size-6 rounded-full shadow-2xl shadow-pri-color border-3",
        "border-zinc-100 dark:border-zinc-900 bg-zinc-50 dark:bg-white"
      )} />
    );
  };

  return (
    <>
      <Spinner visible={isSubmitting} />
      <ScrollView className="flex-1">
        <View className="h-full p-4 gap-4 flex flex-col mb-16">
          {/* Độ tuổi */}
          <View className="relative flex flex-col justify-between gap-6 rounded-lg bg-white dark:bg-zinc-900 shadow p-4">
            <View className="flex flex-row justify-between">
              <Text className="text-lg font-bold">Độ tuổi</Text>
              <Text className="text-lg text-zinc-800 dark:text-zinc-300">
                {rangeAge[0]} - {rangeAge[1]}
              </Text>
            </View>
            <View className="mx-2">
              <RangeSlider
                range={rangeAge}
                onValueChange={setRangeAge}
                step={1}
                minimumValue={18}
                maximumValue={80}
                CustomThumb={CustomThumb}
                inboundColor="#fe183c"
              />
            </View>
          </View>

          {/* Khoảng cách */}
          <View className="relative flex flex-col justify-between gap-6 rounded-lg bg-white dark:bg-zinc-900 shadow p-4">
            <View className="flex flex-row justify-between">
              <Text className="text-lg font-bold">Khoảng cách tối đa (km)</Text>
              <Text className="text-lg text-zinc-800 dark:text-zinc-300">
                {valueDistance} km
              </Text>
            </View>
            <View className="mx-2">
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
          </View>

          {/* Mục đích tìm kiếm */}
          <View className="relative flex flex-col rounded-lg gap-6 bg-white dark:bg-zinc-900 shadow p-4">
            <Text className="text-lg font-bold">Mục đích tìm kiếm</Text>
            <View className="flex flex-row gap-2">
              {["friends", "dating"].map((purpose) => (
                <Pressable
                  key={purpose}
                  className={`h-24 w-full flex-1 flex flex-col justify-center items-center rounded-lg border-2 ${purposeValue === purpose
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
          <View className="relative flex flex-col rounded-lg gap-6 bg-white dark:bg-zinc-900 shadow p-4">
            <Text className="text-lg font-bold">Đang tìm kiếm</Text>
            <View className="flex flex-row gap-2">
              {SEARCH_GENDER_OPTIONS.map(({ label, value: gender }) => (
                <Pressable
                  key={gender}
                  className={`h-24 w-full flex-1 flex flex-col justify-center items-center rounded-lg border-2 ${genderFind === gender
                    ? "border-pri-color bg-white dark:bg-zinc-950"
                    : "border-zinc-200 dark:border-zinc-800"
                    }`}
                  onPress={() => setGenderFind(gender)}
                >
                  {gender === "female" ? (
                    <Icon name="venus" size={32} color={"#fe183c"} />
                  ) : gender === "male" ? (
                    <Icon name="mars" size={32} color={"#0ea5e9"} />
                  ) : (
                    <Smile className="size-6 text-yellow-400" />
                  )}
                  <Text>{label}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Nút Submit */}
          <Button onPress={submitHandler} className="mt-4" variant="red" disabled={!isDirtyFields}>
            <Text>Xác nhận</Text>
          </Button>
        </View>
      </ScrollView>
    </>
  );
}
