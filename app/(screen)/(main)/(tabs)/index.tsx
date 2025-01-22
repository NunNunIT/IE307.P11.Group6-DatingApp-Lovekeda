import React, { useReducer, useCallback, useState, useEffect } from "react";
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
const FETCH_THRESHOLD = 2;

type State = {
  characters: TProfile[];
  currentIndex: number | null;
  isLoading: boolean;
};

type Action =
  | { type: "SET_CHARACTERS"; payload: TProfile[] }
  | { type: "ADD_CHARACTERS"; payload: TProfile[] }
  | { type: "SET_CURRENT_INDEX"; payload: number | null }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "REMOVE_CHARACTER"; payload: number };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_CHARACTERS":
      return { ...state, characters: action.payload };
    case "ADD_CHARACTERS":
      return { ...state, characters: [...state.characters, ...action.payload] };
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

function Skeleton({ profileImage = "https://cdn.aicschool.edu.vn/wp-content/uploads/2024/05/anh-gai-dep-cute.webp" }) {
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
  onSwipe: (dir: "left" | "right") => Promise<void>;
  disabled: boolean;
}) => (
  <View className="absolute bottom-0 flex flex-row items-center gap-6 m-5">
    <Button className="flex-1" variant="secondary" onPress={() => onSwipe("left")} disabled={disabled}>
      <XMarkIcon size={32} color="#fe183c" />
    </Button>
    <Button className="flex-1" variant="red" onPress={() => onSwipe("right")} disabled={disabled}>
      <HeartIcon size={32} color="#fff" />
    </Button>
  </View>
);

export default function Tinder() {
  const [state, dispatch] = useReducer(reducer, {
    characters: [],
    currentIndex: null,
    isLoading: true,
  });
  const { profile, user, isFetching } = useAuth();
  const [page, setPage] = useState(1);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [likeQueue, setLikeQueue] = useState<Array<{user_id: string; target_user_id: string}>>([]);

  const buildUrl = useCallback((page: number) => {
    const gender = profile?.genderFind ?? "all";
    const ageRange = profile?.ageRange?.join("-") ?? "all";
    return `/users/find?limit=${BATCH_SIZE}&page=${page}&gender=${gender}&age=${ageRange}`;
  }, [profile?.genderFind, profile?.ageRange]);

  const postLikes = useCallback(async () => {
    if (likeQueue.length === 0) return;

    try {
      await customizeFetch("/likes", {
        method: "POST",
        body: JSON.stringify(likeQueue),
      });
      setLikeQueue([]);
    } catch (error) {
      console.error("Error posting likes:", error);
    }
  }, [likeQueue]);

  useEffect(() => {
    if (likeQueue.length >= BATCH_SIZE) {
      postLikes();
    }
  }, [likeQueue, postLikes]);

  const fetchUsers = useCallback(async () => {
    if (isFetchingData || !hasMoreData) return;

    try {
      setIsFetchingData(true);
      const url = buildUrl(page);
      const data: TProfile[] = await customizeFetch(url);
      const filteredData = data.filter(item => item.user_id !== user?.uid);

      if (filteredData.length === 0) {
        setHasMoreData(false);
        return;
      }

      dispatch({ type: "ADD_CHARACTERS", payload: filteredData });
      setPage(prev => prev + 1);

      if (state.currentIndex === null) {
        dispatch({ type: "SET_CURRENT_INDEX", payload: filteredData.length - 1 });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsFetchingData(false);
    }
  }, [user?.uid, buildUrl, page, state.currentIndex]);

  useEffect(() => {
    if (user?.uid && profile) {
      fetchUsers();
    }
  }, [user?.uid, profile]);

  useEffect(() => {
    if (!isFetchingData && hasMoreData && state.characters.length <= FETCH_THRESHOLD) {
      fetchUsers();
    }
  }, [state.characters.length, isFetchingData, hasMoreData]);

  const handleSwipe = useCallback((direction: string, index: number) => {
    const swipedUser = state.characters[index];
    if (swipedUser) {
      if (direction === 'right') {
        setLikeQueue(prev => [...prev, {
          user_id: user!.uid,
          target_user_id: swipedUser.user_id,
        }]);
      }
      
      dispatch({ type: "REMOVE_CHARACTER", payload: index });
      dispatch({ type: "SET_CURRENT_INDEX", payload: index - 1 });
    }

    if (state.characters.length <= FETCH_THRESHOLD && hasMoreData) {
      fetchUsers();
    }
  }, [state.characters, user?.uid, hasMoreData]);

  useEffect(() => {
    return () => {
      if (likeQueue.length > 0) {
        postLikes();
      }
    };
  }, [likeQueue, postLikes]);

  const showSkeleton = isFetchingData || state.characters.length === 0;

  return (
    <View className="relative flex-1 w-full h-full">
      <Spinner visible={isFetching} />
      {showSkeleton ? (
        <Skeleton profileImage={profile?.imgs?.[0]} />
      ) : (
        <>
          <View className="flex-1 w-full h-full">
            {state.characters.map((character, index) => (
              <TinderCard
                key={`${character.user_id}-${index}`}
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
            onSwipe={async (dir) => handleSwipe(dir, state.currentIndex!)}
            disabled={state.currentIndex === null || state.currentIndex < 0}
          />
        </>
      )}
    </View>
  );
}