import { useRouter } from "expo-router";
import { Dimensions, Image, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/button";

export default function Onboarding() {
  const router = useRouter();
  return (
    <View
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
        justifyContent: "space-between",
        padding: 24,
        position: "relative",
        backgroundColor: "black",
        paddingBottom: 64,
      }}
    >
      <Image
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height,
        }}
        source={require("@/assets/images/onboarding_bg.jpg")}
      />
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "space-between",
        }}
      >
        <Image
          style={{
            width: 128,
            height: 128,
          }}
          source={require("@/assets/images/logo.png")}
        />
        <Button
          title="C'est parti !"
          onPress={() => {
            router.push("/(auth)/login");
          }}
          icon="chevron-right"
        />
      </SafeAreaView>
    </View>
  );
}
