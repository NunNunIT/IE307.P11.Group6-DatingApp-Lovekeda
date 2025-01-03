// 21522436 - Nguyễn Thị Hồng Nhung
import { Carousel, Image } from "react-native-ui-lib";
import { Dimensions, SafeAreaView, View } from "react-native";
import { Button } from "~/components/ui/button";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "~/components/ui/text";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { router } from "expo-router";
// import {
//   GoogleSignin,
//   statusCodes,
// } from '@react-native-google-signin/google-signin';
import { supabase } from "@/supabase/supabase";

const { width, height } = Dimensions.get("screen");

const decorate = [
  { img: require("~/assets/images/decorate/1.png") },
  { img: require("~/assets/images/decorate/2.png") },
  { img: require("~/assets/images/decorate/3.png") },
  { img: require("~/assets/images/decorate/4.png") },
  { img: require("~/assets/images/decorate/5.png") },
  { img: require("~/assets/images/decorate/6.png") },
];

export default function Login() {
  return (
    <View className="flex-1 relative w-screen h-screen">
      <Carousel
        autoplay
        autoplayInterval={5000}
        loop
        initialPage={2}
        pageWidth={width}
        containerStyle={{ height: height, position: "absolute" }}
        allowAccessibleLayout
      >
        {decorate.map((item, index) => (
          <Image
            key={index}
            source={item.img}
            className="w-full h-full object-cover"
            resizeMode="cover"
          />
        ))}
      </Carousel>

      <LinearGradient
        colors={["transparent", "rgba(0,0,0,1)"]}
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          height: "90%",
          zIndex: 50,
        }}
        start={{ x: 0.5, y: 0.5 }}
        end={{ x: 0.5, y: 1 }}
      />

      <SafeAreaView className="flex-1 items-center justify-between py-16 z-50">
        <Image
          source={require("~/assets/images/logo2.png")}
          className="h-16 w-full object-contain"
          resizeMode="contain"
        />

        <View className="p-4 w-full z-50">
          <Text
            style={{
              fontSize: hp(3.6),
              lineHeight: hp(4.6),
            }}
            className="text-white font-bold text-center text-nowrap mb-8"
          >
            Mua sắm thả ga
          </Text>

          <View className="flex flex-col gap-4">
            <Button
              variant="none"
              className="w-full rounded-full items-center bg-zinc-600/90 active:bg-zinc-800"
              onPress={() => router.push("/auth/login")}
            >
              <Text className="text-white dark:text-white">Đăng nhập</Text>
            </Button>

            <Button
              variant="none"
              className="w-full rounded-full items-center bg-zinc-600/90 active:bg-zinc-800"
              onPress={() => router.push("/auth/register")}
            >
              <Text className="text-white dark:text-white">Đăng ký ngay</Text>
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
