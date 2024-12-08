import LottieView from "lottie-react-native";
import { useEffect, useRef } from "react";
import { StyleSheet } from "react-native";

export default function Loading1() {
  let animationRef = useRef();
  useEffect(() => {
    // To play complete animation
    animationRef.play();
    // Similary you can use this reset, pause, resume

    // To play from a specific startFrame and endFrame
    // animationRef.play(30, 120);
  }, []);
  return (
    <LottieView
      style={styles.lottieView}
      ref={(animation) => {
        animationRef = animation;
      }}
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
