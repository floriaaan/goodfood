import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BasketHeader } from "@/components/basket/header";
import { AppHeader } from "@/components/ui/header";
import { useLocation } from "@/hooks/useLocation";
import { Restaurant } from "@/types/restaurant";

export default function ProductPage() {
  // @ts-ignore
  const { id } = useLocalSearchParams<"/(app)/restaurants/[id]">();
  const { restaurants } = useLocation();

  const [restaurant, setRestaurant] = useState<Restaurant | undefined>(undefined);

  useEffect(() => {
    setRestaurant(restaurants.find((r) => r.id === id));
  }, [id]);

  return (
    <View className="relative flex flex-col justify-between w-screen h-screen p-6 pb-16 bg-white">
      <View className="absolute bottom-0 left-0 w-screen bg-black h-[596px]" />
      <SafeAreaView className="flex flex-col w-full h-full gap-4">
        <View className="w-full">
          <AppHeader />
        </View>
        <View className="w-full">
          <BasketHeader />
        </View>
        <View className="w-full">
          <Text>{JSON.stringify(restaurant, undefined, 2)}</Text>
        </View>
      </SafeAreaView>
    </View>
  );
}
