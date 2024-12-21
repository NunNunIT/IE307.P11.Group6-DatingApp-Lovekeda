import DatesCard from "@/components/card/human";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import React, { useState, useMemo, useRef, useEffect } from "react";
import { ImageBackground, View } from "react-native";
import TinderCard from "react-tinder-card";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  CheckBadgeIcon,
  HeartIcon,
  LockClosedIcon,
  XMarkIcon,
} from "react-native-heroicons/solid";
import Loading1 from "@/components/loading";
import { Image } from "react-native";
import { useAuth } from "@/provider/AuthProvider";
import { USER_DATA } from "@/constant";

const alreadyRemoved: string[] = [];
let charactersState = USER_DATA;

const Tinder = () => {
  const [currentIndex, setCurrentIndex] = useState(USER_DATA.length - 1);
  const [lastDirection, setLastDirection] = useState<string | undefined>();
  const currentIndexRef = useRef(currentIndex);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const childRefs = useMemo(
    () =>
      Array(USER_DATA.length)
        .fill(0)
        .map(() => React.createRef<React.ElementRef<typeof TinderCard>>()), // Correct type for TinderCard ref
    []
  );

  const updateCurrentIndex = (val: number) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const canGoBack = currentIndex < USER_DATA.length - 1;
  const canSwipe = currentIndex >= 0;

  const swiped = (direction: string, nameToDelete: string, index: number) => {
    setLastDirection(direction);
    updateCurrentIndex(index - 1);
  };

  const outOfFrame = (name: string, idx: number) => {
    console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current);
    if (currentIndexRef.current >= idx) {
      childRefs[idx].current?.restoreCard();
    }
  };

  const swipe = async (dir: "left" | "right") => {
    if (canSwipe && currentIndex < USER_DATA.length) {
      await childRefs[currentIndex].current?.swipe(dir);
    }
  };

  const { profile } = useAuth();

  const goBack = async () => {
    if (!canGoBack) return;
    const newIndex = currentIndex + 1;
    updateCurrentIndex(newIndex);
    await childRefs[newIndex].current?.restoreCard();
  };

  useEffect(() => {
    // Giả lập tải dữ liệu
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Tải trong 2 giây

    return () => clearTimeout(timeout); // Xóa timeout khi unmount
  }, []);

  return (
    <View className="relative flex-1 w-full h-full">
      {isLoading ? (
        <View className="w-full h-full flex justify-center items-center">
          <Loading1 />
          <View className="absolute items-center justify-center">
            <Image
              source={{
                uri:
                  profile?.imgs?.[0] ??
                  "https://cdn.aicschool.edu.vn/wp-content/uploads/2024/05/anh-gai-dep-cute.webp",
              }}
              className="rounded-full size-28"
            />
          </View>
        </View>
      ) : (
        <>
          {/* Tinder Cards */}
          <View className="flex-1 w-full h-full">
            {charactersState.map((character, index) => (
              <TinderCard
                ref={childRefs[index]}
                key={character.name}
                onSwipe={(dir) => swiped(dir, character.name, index)}
                onCardLeftScreen={() => outOfFrame(character.name, index)}
              >
                <View className="absolute bg-white w-full shadow-lg">
                  <DatesCard item={character} />
                </View>
              </TinderCard>
            ))}
          </View>

          {/* Buttons */}
          <View className="absolute bottom-0 flex flex-row items-center gap-6 m-5">
            <Button
              className="flex-1"
              variant="secondary"
              onPress={() => swipe("left")}
            >
              <XMarkIcon size={32} color={"#fe183c"} />
            </Button>
            <Button
              className="flex-1"
              variant="red"
              onPress={() => swipe("right")}
            >
              <HeartIcon size={32} color={"#fff"} />
            </Button>
          </View>
        </>
      )}
    </View>
  );
};

export default Tinder;
