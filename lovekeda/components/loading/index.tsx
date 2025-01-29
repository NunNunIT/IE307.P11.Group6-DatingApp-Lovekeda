import LottieView from "lottie-react-native";
import { useEffect, useRef } from "react";
import { StyleSheet } from "react-native";

export default function Loading1() {
  const animationRef = useRef<LottieView>(null);
  useEffect(() => animationRef.current?.play(), []);

  return (
    <LottieView
      ref={animationRef}
      style={styles.lottieView}
      source={require("./loading1.json")}
      autoPlay
      loop
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
  },
  header: {
    fontSize: 24,
    textAlign: "center",
    fontWeight: "bold",
  },
  smallText: {
    fontSize: 18,
    textAlign: "center",
  },
  lottieView: {
    width: 500,
    height: 500,
  },
});
