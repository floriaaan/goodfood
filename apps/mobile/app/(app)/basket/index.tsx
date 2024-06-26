import { useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BasketTaxes } from "@/app/(app)/basket/taxes";
import { BasketHeader } from "@/components/basket/header";
import { ProductBasketCard } from "@/components/product/basket";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/ui/header";
import { useBasket } from "@/hooks/useBasket";
import { isOpenNow } from "@/lib/restaurant";
import { Product } from "@/types/product";

export default function Index() {
  const { basket, products, refetch, selectedRestaurant } = useBasket();
  const [basketProductList, setBasketProductList] = useState<Product[]>([]);

  useEffect(() => {
    if (basket.productsList.length === 0) return;
    setBasketProductList(
      basket.productsList.map((item) => products.find((product) => product.id === item.id)) as Product[],
    );
  }, [basket.productsList]);

  const { goBack, navigate } = useNavigation() as {
    navigate: (href: string, params?: any) => void;
    goBack: () => void;
  };

  return (
    <View className="relative flex flex-col justify-between w-screen h-screen p-6 pb-16 bg-white">
      <View className="absolute bottom-0 left-0 w-screen bg-black h-28" />
      <SafeAreaView className="flex flex-col w-full h-full gap-4">
        <View className="w-full">
          <AppHeader />
        </View>

        <View className="w-full">
          <BasketHeader />
        </View>

        <ScrollView
          className="w-full"
          refreshControl={<RefreshControl refreshing={false} onRefresh={() => refetch()} />}
        >
          <FlatList
            className="grow"
            data={basketProductList}
            renderItem={({ item }) => (
              <View className="pb-4">
                <ProductBasketCard {...item} />
              </View>
            )}
            ItemSeparatorComponent={() => <View className="h-2" />}
            ListEmptyComponent={() => (
              <View className="flex items-center justify-center h-20 pb-4">
                <Text className="text-lg font-bold">Votre panier est vide</Text>
              </View>
            )}
            ListFooterComponent={() => (
              <View className="w-full">
                <BasketTaxes />
              </View>
            )}
          />
        </ScrollView>
        <View className="absolute bottom-0">
          <View className="w-full h-16 bg-white border-t border-neutral-200">
            {selectedRestaurant !== null && !isOpenNow(selectedRestaurant?.openinghoursList) && (
              <View className="flex flex-col items-center justify-center h-full">
                <Text className="text-red-600">Le restaurant {selectedRestaurant.name} est fermé</Text>
                <Text className="text-xs text-red-800">{selectedRestaurant.openinghoursList.join(" / ")}</Text>
              </View>
            )}
          </View>

          <View className="flex flex-row w-full space-x-4">
            <View className="">
              <Button onPress={() => goBack()} icon="home" type="secondary" />
            </View>
            <View className="grow">
              <Button
                disabled={
                  basketProductList.length <= 0 ||
                  !basketProductList[0] ||
                  (selectedRestaurant !== null && !isOpenNow(selectedRestaurant?.openinghoursList))
                }
                icon="arrow-right"
                onPress={() => navigate(`(app)`, { screen: "checkout/selection/index" })}
                title="Étape suivante"
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
