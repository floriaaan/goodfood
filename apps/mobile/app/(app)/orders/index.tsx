import { AppHeader } from "@/components/ui/header";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Orders() {
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
