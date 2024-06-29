import LottieView from "lottie-react-native";
import { StyleSheet, View } from "react-native";

export const LargeLoader = () => {
  return (
    <View style={styles.animationContainer}>
      <LottieView
        autoPlay
        style={{ width: 350, height: 350 }}
        source={require("@/assets/lottie/loader.json")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  animationContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    backgroundColor: "white",
  },
  text: {
    fontSize: 20,
    fontWeight: "700",
  },
});
