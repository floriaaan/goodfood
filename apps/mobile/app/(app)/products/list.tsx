import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BasketHeader } from "@/components/basket/header";
import { ProductCard } from "@/components/product/card";
import { BackButton } from "@/components/ui/button/back";
import { AppHeader } from "@/components/ui/header";
import { SearchInput } from "@/components/ui/input/search";
import { useBasket } from "@/hooks/useBasket";
import { ProductType } from "@/types/product";

export default function ProductListPage() {
  const [search, setSearch] = useState("");

  const params = useLocalSearchParams();
  const { type } = params as { type: string };

  const { products } = useBasket();

  const filteredProducts = products.filter((product) => {
    const t = type !== undefined ? ProductType[type as keyof typeof ProductType] : undefined;
    // Filter products by search if no category is selected
    if (search !== "" && t === undefined) return product.name.toLowerCase().includes(search.toLowerCase());

    // Filter products by search and type
    if (search !== "" && t !== undefined)
      return product.name.toLowerCase().includes(search.toLowerCase()) && product.type === t;

    // Filter products by category
    if (t !== undefined) return product.type === t;
    return true;
  });

  return (
    <View className="relative flex flex-col justify-between w-screen h-screen p-6 pb-16 bg-white">
      <BackButton />
      <SafeAreaView className="flex flex-col w-full h-full space-y-4">
        <View className="w-full">
          <AppHeader />
        </View>
        <View className="w-full">
          <BasketHeader />
        </View>
        {type && (
          <View className="flex flex-row items-center w-full h-12 px-4 bg-black/5">
            <MaterialCommunityIcons
              size={24}
              name={
                type === "ENTREES"
                  ? "bowl-mix"
                  : type === "PLATS"
                  ? "food"
                  : type === "DESSERTS"
                  ? "muffin"
                  : type === "SNACKS"
                  ? "food-apple"
                  : "silverware-fork-knife"
              }
            />
            <Text className="ml-2 text-2xl font-bold text-black">{type.toLocaleUpperCase()}</Text>
          </View>
        )}

        <View className="w-full">
          <SearchInput
            value={search}
            onChangeText={setSearch}
            label="Rechercher un produit"
            placeholder="Goodwich au pesto verde"
          />
        </View>
        <FlatList
          className="flex-1 w-full"
          data={filteredProducts}
          renderItem={({ item }) => <ProductCard width="w-full" className="border border-black" {...item} />}
          ListEmptyComponent={
            <Text className="p-12 text-lg font-bold text-center text-black">Aucun produit trouvé</Text>
          }
        />
      </SafeAreaView>
    </View>
  );
}
