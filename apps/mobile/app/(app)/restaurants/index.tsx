import { useNavigation } from "expo-router";
import React from "react";
import { ActivityIndicator, FlatList, RefreshControl, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { RestaurantCard } from "@/components/restaurant/card";
import { AppHeader } from "@/components/ui/header";
import { useBasket } from "@/hooks/useBasket";
import { useLocation } from "@/hooks/useLocation";

const Restaurants = () => {
  const { restaurants, loading, refetch } = useLocation();
  const { selectedRestaurantId } = useBasket();
  const { goBack } = useNavigation();

  return (
    <View className="relative flex flex-col justify-between w-screen h-screen p-6 pb-16 bg-white">
      <View className="absolute bottom-0 left-0 w-screen bg-black h-28" />
      <SafeAreaView className="flex flex-col w-full h-full gap-4">
        <View className="w-full">
          <AppHeader />
        </View>

        <ScrollView
          className="w-full"
          refreshControl={<RefreshControl refreshing={false} onRefresh={() => refetch()} />}
        >
          <FlatList
            className="flex-grow w-full shrink-0"
            data={restaurants}
            renderItem={({ item }) => (
              <RestaurantCard restaurant={item} onClick={() => goBack()} selected={selectedRestaurantId === item.id} />
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
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default Restaurants;
