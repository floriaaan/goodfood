import { router } from "expo-router";
import React from "react";
import { ActivityIndicator, FlatList, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { RestaurantCard } from "@/components/restaurant/card";
import { BackButton } from "@/components/ui/button/back";
import { AppHeader } from "@/components/ui/header";
import { useBasket } from "@/hooks/useBasket";
import { useLocation } from "@/hooks/useLocation";
import { isOpenNow } from "@/lib/restaurant";

const Restaurants = () => {
  const { restaurants, loading, refetch } = useLocation();
  const { selectedRestaurantId } = useBasket();

  return (
    <View className="relative flex flex-col justify-between w-screen h-screen p-6 pb-16 bg-white">
      <View className="absolute bottom-0 left-0 w-screen bg-black h-[550px]" />
      <BackButton />
      <SafeAreaView className="flex flex-col w-full h-full gap-4">
        <View className="w-full">
          <AppHeader />
        </View>
        <View className="flex flex-col gap-1">
          <Text className="text-2xl font-bold text-black">Restaurants</Text>
          <Text className="text-sm text-black">
            {restaurants.length} restaurant{restaurants.length > 1 ? "s" : ""} trouvés
          </Text>
        </View>
        <FlatList
          refreshControl={<RefreshControl refreshing={false} onRefresh={() => refetch()} />}
          className="flex-grow w-full shrink-0"
          data={restaurants.sort((a, b) =>
            isOpenNow(a.openinghoursList) === isOpenNow(b.openinghoursList)
              ? 0
              : isOpenNow(a.openinghoursList)
              ? -1
              : 1,
          )}
          renderItem={({ item }) => (
            <RestaurantCard
              restaurant={item}
              onClick={() => {
                router.push(`(app)/restaurants/${item.id}`);
              }}
              selected={selectedRestaurantId === item.id}
            />
          )}
          ListEmptyComponent={() => {
            return (
              <View className="p-3">
                {loading ? (
                  <ActivityIndicator size="large" />
                ) : (
                  <Text className="text-white">Aucun restaurant trouvé</Text>
                )}
              </View>
            );
          }}
          ItemSeparatorComponent={() => <View className="h-2 mt-2 border-t border-gray-200" />}
        />
      </SafeAreaView>
    </View>
  );
};

export default Restaurants;
