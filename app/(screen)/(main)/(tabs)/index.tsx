import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
  createRef,
} from "react";
import { View, Image } from "react-native";
import TinderCard from "react-tinder-card";
import { HeartIcon, XMarkIcon } from "react-native-heroicons/solid";
import { Button } from "@/components/ui/button";
import DatesCard from "@/components/card/human";
import Loading1 from "@/components/loading";
import { useAuth } from "@/provider/AuthProvider";
import { useDump } from "@/provider/DumpProvider";
import { supabase } from "@/utils/supabase";
import Spinner from "react-native-loading-spinner-overlay";
import { customizeFetch } from "@/lib/functions";

export default function Tinder() {
  const [characters, setCharacters] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastDirection, setLastDirection] = useState<string | undefined>();
  const currentIndexRef = useRef(currentIndex);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>(true);
  const { value } = useDump();
  const [page, setPage] = useState(1);
  const { profile, user, isFetching } = useAuth();
  const swipedUsersRef = useRef<{ userId: string; direction: string }[]>([]);

  const postSwipeData = async () => {
    try {
      await supabase.from("likes").insert(
        swipedUsersRef.current
          .filter((item) => item.direction === "right")
          .map((s) => ({
            user_id: user!.uid,
            target_user_id: s.userId,
          }))
      );
      swipedUsersRef.current = [];
    } catch (error) {
      // console.error('Error posting swipe data:', error);
    }
  };

  const fetchMoreUsers = useCallback(
    (page: number) => {
      setIsLoading(true);
      setIsFetchingMore(true);
      (async () => {
        try {
          const data = await customizeFetch(
            `/users/find?limit=10&page=${page}&gender=${
              profile?.genderFind ?? "all"
            }&age=${profile?.ageRange?.join("-") ?? "all"}`
          );
          setCharacters((prevCharacters) => {
            if (prevCharacters.length === 0) {
              setCurrentIndex(data.length - 1);
              return data;
            }
            const result = [...prevCharacters, ...data];
            setCurrentIndex(result.length - 1);
            return result;
          });
        } catch (error) {
          setIsLoading(false);
          setIsFetchingMore(false);
        }
      })();
    },
    [value]
  );

  useEffect(() => {
    if (!isFetchingMore) return;
    fetchMoreUsers(page);
  }, [fetchMoreUsers, isFetchingMore]);

  useEffect(() => {
    if (currentIndex < 0) {
      setIsFetchingMore(true);
      setPage((prev) => prev + 1);
    }
  }, [currentIndex]);

  const childRefs = useMemo(
    () =>
      Array(characters.length)
        .fill(0)
        .map(() => createRef<React.ElementRef<typeof TinderCard>>()),
    [characters.length]
  );

  const updateCurrentIndex = (val: number) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  // const canGoBack = currentIndex < characters.length - 1;
  const canSwipe = currentIndex >= 0;

  const swiped = (direction: string, nameToDelete: string, index: number) => {
    setLastDirection(direction);
    updateCurrentIndex(index - 1);

    // Store the swipe data
    const swipedUser = characters[index];
    if (swipedUser) {
      swipedUsersRef.current.push({
        userId: swipedUser.user_id,
        direction: direction,
      });
    }

    // If this was the last card, post the swipe data
    if (index === 0 && swipedUsersRef.current.length > 0) {
      postSwipeData();
    }
  };

  const outOfFrame = (name: string, idx: number) => {
    if (currentIndexRef.current >= idx) {
      childRefs[idx].current?.restoreCard();
    }
  };

  const swipe = async (dir: "left" | "right") => {
    if (canSwipe && currentIndex < characters.length) {
      childRefs[currentIndex].current?.swipe(dir);
    }
  };

  // const goBack = async () => {
  //   if (!canGoBack) return;
  //   const newIndex = currentIndex + 1;
  //   updateCurrentIndex(newIndex);
  //   await childRefs[newIndex].current?.restoreCard();
  // };

  const data = useMemo(
    () =>
      characters
        .filter((item) => item.user_id !== user!.uid)
        .filter((item: any) => {
          return !value?.filter?.ageRange || !item.age
            ? true
            : item.age >= value.filter.ageRange[0] &&
                item.age <= value.filter.ageRange[1];
        })
        .filter((item: any) =>
          !value?.filter?.genderFind ||
          !item.gender ||
          value?.filter?.genderFind === "all"
            ? true
            : item.gender === value?.filter?.genderFind
        ),
    [characters, value]
  );

  return (
    <View className="relative flex-1 w-full h-full">
      <Spinner visible={isFetching} />
      {isLoading || isFetchingMore || characters.length === 0 ? (
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
          <View className="flex-1 w-full h-full">
            {data.map((character, index) => (
              <TinderCard
                key={character.name + index}
                ref={childRefs[index]}
                onSwipe={(dir) => swiped(dir, character.name, index)}
                onCardLeftScreen={() => outOfFrame(character.name, index)}
              >
                <View className="absolute bg-white w-full shadow-lg">
                  <DatesCard item={character} />
                </View>
              </TinderCard>
            ))}
          </View>

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
}
