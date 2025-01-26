import ImageUploadType2 from "@/components/imageUpload/type2";
import SingleChoicePicker from "@/components/select/oneChoice";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { View, Text, Pressable } from "react-native";
import { ProgressSteps, ProgressStep } from "react-native-progress-steps";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextField } from "react-native-ui-lib";
import { useAuth } from "@/providers/AuthProvider";
import Spinner from "react-native-loading-spinner-overlay";
import { Button } from "@/components/ui/button";
import { GENDER_OPTIONS, SEARCH_GENDER_OPTIONS } from "@/constants/common";
import { customizeFetch } from "@/lib/functions";
import { cn } from "@/lib/utils";

export default function SetUpProfileScreen() {
  const { colorScheme } = useColorScheme();
  const [name, setName] = useState("");
  const [gender, setGender] = useState<string>("male");
  const [age, setAge] = useState<string | undefined>(undefined);
  const [bio, setBio] = useState("");
  const [genderFind, setGenderFind] = useState<string>("male");
  const [purposeValue, setPurposeValue] = useState<string>("friends");
  const [imgs, setImgs] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isFetching, signOut, profile, getProfile, user } = useAuth();
  const user_id = user!.uid;
  useEffect(() => {
    (async () => getProfile(user_id))();
  }, [user_id]);

  useEffect(() => {
    if (profile?.name) setName(profile.name);
    if (profile?.age) setAge(profile.age.toString());
    if (profile?.bio) setBio(profile.bio);
    if (profile?.genderFind) setGenderFind(profile.genderFind);
    if (profile?.purposeValue) setPurposeValue(profile.purposeValue);
    if (profile?.imgs) setImgs(profile.imgs);
  }, [profile]);

  const defaultScrollViewProps = {
    keyboardShouldPersistTaps: "handled",
    contentContainerStyle: {
      flex: 1,
      justifyContent: "center",
    },
  };

  const onNextStep1 = async () => {
    setIsSubmitting(true);
    await customizeFetch(`/users/${user_id}`, {
      method: "PATCH",
      body: JSON.stringify({
        name,
        gender,
        age: Number(age),
        bio,
      }),
    });
    await getProfile?.();
    setIsSubmitting(false);
  };

  const onNextStep2 = async () => {
    setIsSubmitting(true);
    await customizeFetch(`/users/${user_id}`, {
      method: "PATCH",
      body: JSON.stringify({
        genderFind,
        purposeValue,
      }),
    });
    await getProfile?.();
    setIsSubmitting(false);
  };

  const onPrevStep = () => {
    console.log("called previous step");
  };

  const onSubmitSteps = async () => {
    setIsSubmitting(true);
    await customizeFetch(`/users/${user_id}`, {
      method: "PATCH",
      body: JSON.stringify({ imgs, is_complete_profile: true }),
    });
    await getProfile?.();
    setIsSubmitting(false);
    router.replace("/(screen)/(main)/(tabs)");
  };

  const progressStepsStyle = {
    activeStepIconBorderColor: "#fe183c",
    activeLabelColor: "#fe183c",
    activeStepNumColor: "white",
    activeStepIconColor: "#fe183c",
    completedStepIconColor: "#fe183c",
    completedProgressBarColor: "#fe183c",
    completedCheckColor: "white",
    labelFontSize: 12,
    completedStepNumColor: "#fe183c",
  };

  const buttonTextStyle = {
    color: "#fe183c",
    fontWeight: "bold",
  };

  return (
    <SafeAreaView
      className="relative bg-white dark:bg-black"
      style={{ flex: 1 }}
    >
      <Spinner visible={isFetching || isSubmitting} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <ProgressSteps {...progressStepsStyle}>
          {renderSetUpProfileStepOne(
            onNextStep1,
            name,
            age,
            signOut,
            defaultScrollViewProps,
            buttonTextStyle,
            colorScheme,
            setName,
            gender,
            setGender,
            setAge,
            bio,
            setBio
          )}
          {renderSetUpProfileStepTwo(
            onNextStep2,
            onPrevStep,
            defaultScrollViewProps,
            buttonTextStyle,
            genderFind,
            setGenderFind,
            purposeValue,
            setPurposeValue
          )}
          {renderSetUpProfileStepThree(
            onPrevStep,
            defaultScrollViewProps,
            buttonTextStyle,
            onSubmitSteps,
            imgs,
            setImgs
          )}
        </ProgressSteps>
      </ScrollView>
    </SafeAreaView>
  );
}

function renderSetUpProfileStepThree(
  onPrevStep: () => void,
  defaultScrollViewProps: {
    keyboardShouldPersistTaps: string;
    contentContainerStyle: { flex: number; justifyContent: string };
  },
  buttonTextStyle: { color: string; fontWeight: string },
  onSubmitSteps: () => Promise<void>,
  imgs: string[],
  setImgs: any
) {
  return (
    <ProgressStep
      label="Hình ảnh"
      onPrevious={onPrevStep}
      scrollViewProps={defaultScrollViewProps}
      finishBtnStyle={buttonTextStyle}
      onSubmit={onSubmitSteps}
      nextBtnDisabled={imgs.length === 0}
      nextBtnTextStyle={buttonTextStyle}
      previousBtnTextStyle={buttonTextStyle}
      finishBtnText={"Hoàn thành"}
      previousBtnText={"Quay lại"}
      nextBtnStyle={{ paddingInline: 0 }}
    >
      <View className="w-full h-full p-4 flex justify-start items-start">
        <ImageUploadType2 imgs={imgs} setImgs={setImgs} />
      </View>
    </ProgressStep>
  );
}

function renderSetUpProfileStepTwo(
  onNextStep2: () => Promise<void>,
  onPrevStep: () => void,
  defaultScrollViewProps: {
    keyboardShouldPersistTaps: string;
    contentContainerStyle: { flex: number; justifyContent: string };
  },
  buttonTextStyle: { color: string; fontWeight: string },
  genderFind: string,
  setGenderFind: any,
  purposeValue: string,
  setPurposeValue: any
) {
  return (
    <ProgressStep
      label="Mục đích"
      onNext={onNextStep2}
      onPrevious={onPrevStep}
      scrollViewProps={defaultScrollViewProps}
      nextBtnTextStyle={buttonTextStyle}
      nextBtnText={"Tiếp tục"}
      previousBtnTextStyle={buttonTextStyle}
      previousBtnText={"Quay lại"}
      nextBtnStyle={{ paddingInline: 0 }}
    >
      <View className="w-full h-full flex flex-col justify-start items-center p-4">
        <View className="">
          <Text className="pl-4 text-black dark:text-white font-bold text-lg mb-1">
            Bạn đang tìm kiếm
          </Text>
          <View className="px-6 py-4 flex justify-start items-start bg-zinc-100 dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-full">
            <SingleChoicePicker
              value={genderFind}
              onChange={(value) => setGenderFind(value as string)}
              title="Chọn một"
              placeholder="Chọn một giá trị"
              options={[...SEARCH_GENDER_OPTIONS]}
              useDialogDefault
            />
          </View>
        </View>

        <View className="w-full mt-4">
          <Text className="pl-4 text-black dark:text-white font-bold text-lg mb-2">
            Bạn cần mối quan hệ
          </Text>
          <View className="flex flex-row gap-6">
            {["friends", "dating"].map((purpose) => (
              <Pressable
                key={purpose}
                onPress={() => setPurposeValue(purpose)}
                className={cn(
                  "h-24 w-full flex-1 flex flex-col justify-center items-center rounded-lg border-2",
                  purposeValue === purpose
                    ? "border-pri-color bg-white dark:bg-zinc-900"
                    : "border-zinc-200 dark:border-zinc-800"
                )}
              >
                <Text className="text-2xl">
                  {purpose === "friends" ? "👋" : "❤️"}
                </Text>
                <Text className="text-black dark:text-white">
                  {purpose === "friends" ? "Tìm bạn" : "Tìm người yêu"}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </ProgressStep>
  );
}

function renderSetUpProfileStepOne(
  onNextStep1: () => Promise<void>,
  name: string,
  age: string | undefined,
  signOut: (() => Promise<void>) | undefined,
  defaultScrollViewProps: {
    keyboardShouldPersistTaps: string;
    contentContainerStyle: { flex: number; justifyContent: string };
  },
  buttonTextStyle: { color: string; fontWeight: string },
  colorScheme: string | undefined,
  setName: any,
  gender: string,
  setGender: any,
  setAge: any,
  bio: string,
  setBio: any
) {
  return (
    <ProgressStep
      label="Thông tin"
      onNext={onNextStep1}
      nextBtnDisabled={
        name === "" ||
        typeof age === "undefined" ||
        Number(age!) < 18 ||
        Number(age!) > 100
      }
      onPrevious={() => signOut?.()}
      scrollViewProps={defaultScrollViewProps}
      nextBtnTextStyle={buttonTextStyle}
      nextBtnText={"Tiếp tục"}
      previousBtnTextStyle={buttonTextStyle}
      previousBtnText={"Trở về"}
      nextBtnStyle={{ paddingInline: 0 }}
    >
      <View className="w-full h-full flex flex-col justify-start items-center p-4">
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
                onChange={(value) => setGender(value as string)}
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
          value={bio}
          onChangeText={setBio}
          placeholder={"Viết gì đó giới thiệu bạn với mọi người"}
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
        <Button onPress={signOut} variant="outline" className="dark:text-white">
          <Text>Đăng xuất</Text>
        </Button>
      </View>
    </ProgressStep>
  );
}
