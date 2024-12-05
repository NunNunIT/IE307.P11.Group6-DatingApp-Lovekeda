import DatesCard from "@/components/card/human";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import React, { useState, useMemo, useRef } from "react";
import { ImageBackground, View } from "react-native";
import TinderCard from "react-tinder-card";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  CheckBadgeIcon,
  HeartIcon,
  LockClosedIcon,
  XMarkIcon,
} from "react-native-heroicons/solid";

const db = [
  {
    name: "Richard Hendricks",
    imgs: ["https://phanmemmkt.vn/wp-content/uploads/2024/09/avt-Facebook-cho-am-dep.jpg", "https://img.hoidap247.com/picture/question/20210904/large_1630765811060.jpg", "https://placehold.co/400", "https://img.hoidap247.com/picture/question/20210904/large_1630765811060.jpg" ],
    age: "18",
    city: "HCM",
    country: "VN",
  },
  {
    name: "Erlich Bachman",
    imgs: ["https://placehold.co/400", "https://placehold.co/400", "https://placehold.co/400", "https://placehold.co/400" ],
    age: "18",
    city: "HCM",
    country: "VN",
  },
  {
    name: "Monica Hall",
    imgs: ["https://placehold.co/400", "https://placehold.co/400", "https://placehold.co/400", "https://placehold.co/400" ],
    age: "18",
    city: "HCM",
    country: "VN",
  },
  {
    name: "Jared Dunn",
    imgs: ["https://placehold.co/400", "https://placehold.co/400", "https://placehold.co/400", "https://placehold.co/400" ],
    age: "18",
    city: "HCM",
    country: "VN",
  },
  {
    name: "Dinesh Chugtai",
    imgs: ["https://placehold.co/400", "https://placehold.co/400", "https://placehold.co/400", "https://placehold.co/400" ],
    age: "18",
    city: "HCM",
    country: "VN",
  },
];

const alreadyRemoved: string[] = [];
let charactersState = db;

const Tinder = () => {
  const [currentIndex, setCurrentIndex] = useState(db.length - 1);
  const [lastDirection, setLastDirection] = useState<string | undefined>();
  const currentIndexRef = useRef(currentIndex);

  const childRefs = useMemo(
    () =>
      Array(db.length)
        .fill(0)
        .map(() => React.createRef<React.ElementRef<typeof TinderCard>>()), // Correct type for TinderCard ref
    []
  );

  const updateCurrentIndex = (val: number) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const canGoBack = currentIndex < db.length - 1;
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
    if (canSwipe && currentIndex < db.length) {
      await childRefs[currentIndex].current?.swipe(dir);
    }
  };

  const goBack = async () => {
    if (!canGoBack) return;
    const newIndex = currentIndex + 1;
    updateCurrentIndex(newIndex);
    await childRefs[newIndex].current?.restoreCard();
  };
  return (
    <SafeAreaView className="flex-1 flex flex-col items-center justify-between w-full h-full">
      {/* Tinder Cards */}
      <View className="relative flex-1 w-full">
        {db.map((character, index) => (
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
      <View className="relative flex-row items-center gap-6 m-5">
        <Button
          className="w-1/2 rounded-full"
          // size="icon"
          variant="secondary"
          onPress={() => swipe("left")}
        >
          <XMarkIcon size={32} color={"#fe183c"} />
        </Button>
        {/* <Button className="rounded-full" size="icon" onPress={() => goBack()}>
          <Text>Undo</Text>
        </Button> */}
        <Button
          className="w-1/2 rounded-full"
          // size="icon"
          variant="secondary"

          onPress={() => swipe("right")}
        >
          <HeartIcon size={32} color={"#fe183c"} />
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default Tinder;
