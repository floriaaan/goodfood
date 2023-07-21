import { BasketHeader } from "@/components/basket/header";
import { ProductCard } from "@/components/product/card";
import { RestaurantCard } from "@/components/restaurant/card";
import { AppHeader } from "@/components/ui/header";
import { CategoryHeader } from "@/components/ui/header/category";
import { SearchInput } from "@/components/ui/input/search";
import { productList, restaurantList } from "@/constants/data";
import { useAuth } from "@/hooks/auth";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Redirect } from "expo-router";
import { useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const { user } = useAuth();
  if (!user) return <Redirect href="(onboarding)/first" />;

  const [search, setSearch] = useState("");

  return (
    <View className="flex flex-col justify-between w-screen h-screen p-6 pb-16 bg-white">
      <View className="absolute bottom-0 left-0 w-screen bg-black h-96"></View>
      <SafeAreaView className="flex flex-col w-full h-full gap-4">
        <View className="w-full">
          <AppHeader />
        </View>
        <View className="w-full">
          <BasketHeader />
        </View>
        <View className="w-full">
          <SearchInput
            value={search}
            onChangeText={setSearch}
            label="Rechercher un produit"
            placeholder="Goodwich au pesto verde"
          />
        </View>

        <View className="flex flex-row items-center">
          <TouchableOpacity className="flex flex-row items-center justify-center w-1/2 h-12 mr-2 bg-black/5">
            <MaterialCommunityIcons name="bowl-mix" size={24} />
            <Text className="ml-1 text-lg font-bold text-black">Entrées</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex flex-row items-center justify-center w-1/2 h-12 ml-2 bg-black/5">
            <MaterialCommunityIcons name="food" size={24} />
            <Text className="ml-1 text-lg font-bold text-black">Plats</Text>
          </TouchableOpacity>
        </View>
        <View className="flex flex-row items-center">
          <TouchableOpacity className="flex flex-row items-center justify-center w-1/2 h-12 mr-2 bg-black/5">
            <MaterialCommunityIcons name="muffin" size={24} />
            <Text className="ml-1 text-lg font-bold text-black">Desserts</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex flex-row items-center justify-center w-1/2 h-12 ml-2 bg-black/5">
            <MaterialCommunityIcons name="food-apple" size={24} />
            <Text className="ml-1 text-lg font-bold text-black">Snacks</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          className="flex-grow-0 w-screen shrink-0"
          horizontal
          data={productList}
          renderItem={({ item }) => <ProductCard {...item} />}
        />
        <View className="w-full">
          <CategoryHeader
            title="Liste des restaurants"
            subtitle="On est ici, par là, un peu ici, un peu partout en fait !"
            href="/restaurants"
          />
        </View>
        <FlatList
          className="flex-grow w-full shrink-0"
          data={restaurantList}
          renderItem={({ item }) => <RestaurantCard {...item} />}
        />
      </SafeAreaView>
    </View>
  );
}
