import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function Onboarding() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) router.push("/(app)/home");
  }, []);
  return (
    <View className="flex flex-col justify-between w-screen h-screen p-6 pb-16 bg-black">
      <Image
        className="absolute top-0 left-0 w-screen h-screen"
        source={require("@/assets/images/onboarding_bg.jpg")}
      />
      <SafeAreaView className="flex flex-col justify-between h-full">
        <Image className="w-32 h-32" source={require("@/assets/images/logo.png")} />
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
