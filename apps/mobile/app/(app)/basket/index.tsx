import { useNavigation } from "expo-router";
import { FlatList, RefreshControl, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ProductBasketCard } from "@/components/product/basket";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/ui/header";
import { useBasket } from "@/hooks/useBasket";
import { Product } from "@/types/product";
import React, { useEffect, useState } from "react";
import { BasketTaxes } from "@/app/(app)/basket/taxes";
import { BasketHeader } from "@/components/basket/header";

export default function Index() {
  const { basket, products, refetch } = useBasket();
  const [basketProductList, setBasketProductList] = useState<Product[]>([]);

  useEffect(() => {
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
              <View className="flex h-20 items-center justify-center">
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
          <View className="flex flex-row w-full space-x-4">
            <View className="">
              <Button onPress={() => goBack()} icon="home" type="secondary" />
            </View>
            <View className="grow">
              <Button
                icon="arrow-right"
                onPress={() => navigate(`(app)`, { screen: "checkout/index" })}
                title="Étape suivante"
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
