import { AppHeader } from "@/components/ui/header";
import { useAuth } from "@/hooks/auth";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Redirect } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Orders() {
  const { user } = useAuth();
  if (!user) return <Redirect href="(onboarding)/first" />;

  return (
    <View className="relative flex flex-col justify-between w-screen h-screen p-6 pb-16 bg-white">
      <View className="absolute bottom-0 left-0 w-screen bg-black h-96"></View>
      <SafeAreaView className="flex flex-col w-full h-full gap-4">
        <View className="w-full">
          <AppHeader />
        </View>
      </SafeAreaView>
    </View>
  );
}
