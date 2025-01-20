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

function Skeleton() {
  const { profile } = useAuth();

  return (
    <View className="w-full h-full flex justify-center items-center">
      <Loading1 />
      <View className="absolute items-center justify-center">
        <Image
          className="rounded-full size-28"
          source={{
            uri:
              profile?.imgs?.[0] ??
              "https://cdn.aicschool.edu.vn/wp-content/uploads/2024/05/anh-gai-dep-cute.webp",
          }}
        />
      </View>
    </View>
  );
}

function renderCharacterCards(
  data: TProfile[],
  childRefs: any[],
  swiped: (direction: string, nameToDelete: string, index: number) => void,
  outOfFrame: (name: string, idx: number) => void,
  swipe: (dir: "left" | "right") => Promise<void>
): React.ReactNode {
  return (
    <>
      <View className="flex-1 w-full h-full">
        {data.map((item, index) => (
          <TinderCard
            key={item.name + index}
            ref={childRefs[index]}
            onSwipe={(dir) => swiped(dir, item.name, index)}
            onCardLeftScreen={() => outOfFrame(item.name, index)}
          >
            <View className="absolute bg-white w-full shadow-lg">
              <DatesCard item={item} />
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
        <Button className="flex-1" variant="red" onPress={() => swipe("right")}>
          <HeartIcon size={32} color={"#fff"} />
        </Button>
      </View>
    </>
  );
}

export default function Tinder() {
  const [characters, setCharacters] = useState<TProfile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentIndexRef = useRef(currentIndex);
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>(true);
  const { value } = useDump();
  const [page, setPage] = useState(1);
  console.log("🚀 ~ Tinder ~ page:", page);
  const { profile, user, isFetching } = useAuth();
  const swipedUsersRef = useRef<{ userId: string; direction: string }[]>([]);

  // TODO: change to customizeFetch
  const postSwipeData = async () => {
    try {
      // await supabase.from("likes").insert(
      //   swipedUsersRef.current
      //     .filter((item) => item.direction === "right")
      //     .map((s) => ({
      //       user_id: user!.uid,
      //       target_user_id: s.userId,
      //     }))
      // );
      setPage((prev) => prev + 1);
      swipedUsersRef.current = [];
    } catch (error) {
      // console.error('Error posting swipe data:', error);
    }
  };

  const fetchMoreUsers = useCallback(
    async (page: number) => {
      setIsFetchingMore(true);
      try {
        const url = `/users/find?limit=10&page=${page}&gender=${
          profile?.genderFind ?? "all"
        }&age=${profile?.ageRange?.join("-") ?? "all"}`;
        const data: TProfile[] = await customizeFetch(url);
        setCharacters((prevCharacters) => {
          const filteredData = data.filter(
            (item) => item.user_id !== user!.uid
          );
          const result = [...prevCharacters, ...filteredData];
          setCurrentIndex(result.length - 1);
          return result;
        });
      } catch (error) {
        console.error("Error fetching more users:", error);
      } finally {
        setIsFetchingMore(false);
      }
    },
    [value]
  );

  useEffect(() => {
    if (currentIndex >= 0) return;
    setPage((prev) => prev + 1);
    fetchMoreUsers(page);
  }, [currentIndex, setPage, fetchMoreUsers]);

  const childRefs = useMemo(
    () =>
      Array({ length: characters.length }).map(() =>
        createRef<React.ElementRef<typeof TinderCard>>()
      ),
    [characters.length]
  );
  console.log("🚀 ~ Tinder ~ childRefs:", childRefs);

  const updateCurrentIndex = (val: number) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  // const canGoBack = currentIndex < characters.length - 1;
  const canSwipe = currentIndex >= 0;

  const swiped = (direction: string, nameToDelete: string, index: number) => {
    updateCurrentIndex(index - 1);

    const swipedUser = characters[index];
    if (swipedUser) {
      swipedUsersRef.current.push({
        userId: swipedUser.user_id!,
        direction: direction,
      });
    }

    if (index === 0 && swipedUsersRef.current.length > 0) {
      postSwipeData();
    }
  };

  const outOfFrame = (name: string, idx: number) => {
    if (currentIndexRef.current < idx) return;
    childRefs[idx].current?.restoreCard();
  };

  const swipe = async (dir: "left" | "right") => {
    if (canSwipe && currentIndex < characters.length) {
      childRefs[currentIndex].current?.swipe(dir);
    }
  };

  const data = useMemo(() => characters, [characters, value]);

  return (
    <View className="relative flex-1 w-full h-full">
      <Spinner visible={isFetching} />
      {isFetchingMore || data.length === 0 ? (
        <Skeleton />
      ) : (
        renderCharacterCards(data, childRefs, swiped, outOfFrame, swipe)
      )}
    </View>
  );
}
