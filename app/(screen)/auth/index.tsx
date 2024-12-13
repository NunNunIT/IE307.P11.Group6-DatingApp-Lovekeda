// 21522436 - Nguyễn Thị Hồng Nhung

import { Carousel, Image } from "react-native-ui-lib";
import { Dimensions, View } from "react-native";
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin'
import { Button } from "~/components/ui/button";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "~/components/ui/text";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { router } from "expo-router";
import { supabase } from '~/utils/supabase'

var { width, height } = Dimensions.get("window");

const decorate = [
  { img: require("~/assets/images/decorate/1.png") },
  { img: require("~/assets/images/decorate/9.png") },
  { img: require("~/assets/images/decorate/3.png") },
  { img: require("~/assets/images/decorate/4.png") },
  { img: require("~/assets/images/decorate/6.png") },
  { img: require("~/assets/images/decorate/7.png") },
];

const handleLoginGoogle = async () => {
  // Nếu như user mới thì chuyển về createProfile
  // còn user cũ thì (main)/(tabs)/index
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    if (userInfo?.data?.idToken) {
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: userInfo.data.idToken,
      });

      if (error) {
        console.error(error);
      } else {
        const { user } = data;
        const isNewUser = !user?.last_sign_in_at;
        if (isNewUser) {
          router.push("/(screen)/auth/createProfile")
        } else {
          router.push("/(screen)/(main)/(tabs)")
        }
      }
    } else {
      throw new Error('No ID token present!');
    }
  } catch (error: any) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      // user cancelled the login flow
    } else if (error.code === statusCodes.IN_PROGRESS) {
      // operation (e.g. sign in) is in progress already
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      // play services not available or outdated
    } else {
      console.error('Sign-in error:', error);
    }
  }
};

GoogleSignin.configure({
  scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  webClientId: process.env.EXPO_PUBLIC_ANDROID_GOOGLE_CLIENT_ID,
})

export default function Login() {
  return (
    <View
      className="flex-1 relative"
      style={{
        height: height,
        width: width,
      }}
    >
      <Carousel
        autoplay
        autoplayInterval={5000}
        loop
        initialPage={2}
        pageWidth={width}
        containerStyle={{ height: height }}
        // pageControlPosition={Carousel.pageControlPositions.UNDER}
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
        }}
        start={{ x: 0.5, y: 0.5 }}
        end={{ x: 0.5, y: 1 }}
      />

      <View className="absolute top-8 left-2 h-16 w-full">
        <Image
          source={require("~/assets/images/logo2.png")}
          className="h-16 w-full object-contain"
          resizeMode="contain"
        />
      </View>

      <View className="absolute bottom-32 p-4 w-full">
        <Text
          style={{
            fontSize: hp(3.6),
            lineHeight: hp(4.6),
          }}
          className="text-white font-bold text-center text-nowrap"
        >
          Tìm bạn bè, người yêu
        </Text>
        <Text
          style={{
            fontSize: hp(3.6),
            lineHeight: hp(4.6),
          }}
          className="text-white font-bold text-center mb-8"
        >
          thật dễ dàng
        </Text>

        <Button
          variant="none"
          className="w-full rounded-full mb-4 bg-white dark:bg-white active:bg-black "
          onPress={handleLoginGoogle}
        >
          <View className="flex flex-row gap-3">
            <Image
              source={require("~/assets/images/google.png")}
              className="aspect-square size-8 overflow-hidden rounded-full"
            />
            <Text className="text-sm text-zinc-900 group-active:text-white">
              Đăng nhập bằng Google
            </Text>
          </View>
        </Button>

        <Button
          variant="none"
          className="w-full rounded-full items-center bg-zinc-600/90 active:bg-zinc-800"
          onPress={() => router.push("/auth/loginDev")}
        >
          <Text className="text-white dark:text-white">Đăng nhập Dev</Text>
        </Button>
      </View>
    </View>
  );
}
