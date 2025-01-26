import React, {
  useReducer,
  useCallback,
  useState,
  useEffect,
  createRef,
  useMemo,
  RefObject,
} from "react";
import { View, Image } from "react-native";
import TinderCard from "react-tinder-card";
import { HeartIcon, XMarkIcon } from "react-native-heroicons/solid";
import { Button } from "@/components/ui/button";
import DatesCard from "@/components/card/human";
import Loading1 from "@/components/loading";
import { useAuth } from "@/provider/AuthProvider";
import Spinner from "react-native-loading-spinner-overlay";
import { customizeFetch } from "@/lib/functions";

const BATCH_SIZE = 10;

type State = {
  characters: TProfile[];
  currentIndex: number;
  isLoading: boolean;
};

type Action =
  | { type: "SET_CHARACTERS"; payload: TProfile[] }
  | { type: "ADD_CHARACTERS"; payload: TProfile[] }
  | { type: "SET_CURRENT_INDEX"; payload: number }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "REMOVE_CHARACTER"; payload: number };

type TDirection = "left" | "right" | "up" | "down";

interface TinderCardRef {
  swipe: (dir?: TDirection) => Promise<void>;
  restoreCard: () => Promise<void>;
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_CHARACTERS":
      return { ...state, characters: action.payload, currentIndex: action.payload.length - 1 };
    case "ADD_CHARACTERS":
      return {
        ...state,
        characters: [...state.characters, ...action.payload],
      };
    case "SET_CURRENT_INDEX":
      return { ...state, currentIndex: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "REMOVE_CHARACTER":
      return {
        ...state,
        characters: state.characters.filter((_, i) => i !== action.payload),
      };
    default:
      return state;
  }
};

function Skeleton({ profileImage }: { profileImage?: string }) {
  return (
    <View className="w-full h-full flex justify-center items-center">
      <Loading1 />
      <View className="absolute items-center justify-center">
        <Image className="rounded-full size-28" source={{ uri: profileImage }} />
      </View>
    </View>
  );
}

const SwipeButtons = ({
  onSwipe,
  disabled,
}: {
  onSwipe: (dir: TDirection) => Promise<void>;
  disabled: boolean;
}) => (
  <View className="absolute bottom-0 flex flex-row items-center gap-6 m-5">
    <Button
      className="flex-1"
      variant="secondary"
      onPress={() => onSwipe("left")}
      disabled={disabled}
    >
      <XMarkIcon size={32} color="#fe183c" />
    </Button>
    <Button
      className="flex-1"
      variant="red"
      onPress={() => onSwipe("right")}
      disabled={disabled}
    >
      <HeartIcon size={32} color="#fff" />
    </Button>
  </View>
);

const buildUrl = (currentPage: number, profile: TProfile | null) => {
  if (!profile) return null;

  const gender = profile.genderFind ?? "all";
  const ageRange = profile.ageRange?.join("-") ?? "all";
  const distance = profile.filterDistance;

  const url = `/users/find?limit=${BATCH_SIZE}&page=${currentPage}&gender=${gender}&age=${ageRange}&distance=${distance}`;

  // if (profile.locate?.coordinates) {
  //   const [long, lat] = profile.locate.coordinates;
  //   return url + `&long=${long}&lat=${lat}`;
  // }

  return url;
};

export default function Tinder() {
  const [state, dispatch] = useReducer(reducer, {
    characters: [],
    currentIndex: -1,
    isLoading: true,
  });
  const arrayRef = useMemo<RefObject<TinderCardRef>[]>(
    () =>
      Array(state.characters.length)
        .fill(null)
        .map(() => createRef()),
    [state.characters.length]
  );

  const { profile, isFetching } = useAuth();
  const [page, setPage] = useState(1);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [likeQueue, setLikeQueue] = useState<
    Array<{ target_user_id: string; emotion: string }>
  >([]);

  useEffect(() => {
    if (!profile) return;

    dispatch({ type: "SET_CHARACTERS", payload: [] });
    setPage(1);
    setHasMoreData(true);
  }, [
    profile?.genderFind,
    profile?.ageRange,
    profile?.filterDistance,
    profile?.locate?.coordinates,
  ]);

  const postLikes = useCallback(async () => {
    if (!profile?.user_id || likeQueue.length === 0) return;

    try {
      await customizeFetch("/users/swipe-batch", {
        method: "POST",
        body: JSON.stringify({
          user_id: profile.user_id,
          swipes: likeQueue,
        }),
      });
      setLikeQueue([]);
    } catch (error) {
      console.error("Error posting likes:", error);
    }
  }, [profile?.user_id, likeQueue]);

  const fetchUsers = useCallback(
    async () => {
      if (!profile || !hasMoreData || isFetchingData) return;

      const url = buildUrl(page, profile);
      if (!url) return;

      try {
        setIsFetchingData(true);
        const data: TProfile[] = await customizeFetch(url);
        const filteredData = data.filter(
          (item) => item.user_id !== profile.user_id
        );

        if (filteredData.length === 0) {
          setHasMoreData(false);
          return;
        }

        dispatch({ type: "ADD_CHARACTERS", payload: filteredData });
        setPage((prev) => prev + 1);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsFetchingData(false);
      }
    },
    [profile, page, hasMoreData, isFetchingData]
  );

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSwipe = useCallback(
    async (direction: TDirection, index: number) => {
      if (!profile) return;

      const currentRef = arrayRef[index];
      if (currentRef?.current) await currentRef.current?.swipe(direction);

      const swipedUser = state.characters[index];
      if (swipedUser && direction === "right") {
        setLikeQueue((prev) => [
          ...prev,
          { target_user_id: swipedUser.user_id, emotion: "like" },
        ]);
      }

      dispatch({ type: "REMOVE_CHARACTER", payload: index });
      dispatch({ type: "SET_CURRENT_INDEX", payload: index - 1 });
    },
    [arrayRef, state.characters, profile]
  );

  useEffect(() => {
    if (likeQueue.length >= BATCH_SIZE) postLikes();
  }, [likeQueue, postLikes]);

  return (
    <View className="relative flex-1 w-full h-full">
      <Spinner visible={isFetching} />
      {state.characters.length === 0 ? (
        <Skeleton profileImage={profile?.imgs?.[0]} />
      ) : (
        <>
          <View className="flex-1 w-full h-full">
            {state.characters.map((character, index) => (
              <TinderCard
                key={character.user_id}
                ref={arrayRef[index]}
                onSwipe={(dir) => handleSwipe(dir, index)}
                preventSwipe={["up", "down"]}
              >
                <View className="absolute bg-white w-full shadow-lg">
                  <DatesCard item={character} />
                </View>
              </TinderCard>
            ))}
          </View>
          <SwipeButtons
            onSwipe={async (dir) =>
              handleSwipe(dir, Math.max(state.currentIndex, 0))
            }
            disabled={state.currentIndex < 0}
          />
        </>
      )}
    </View>
  );
}
