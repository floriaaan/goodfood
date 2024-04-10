import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ImageSourcePropType, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BasketHeader } from "@/components/basket/header";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/ui/header";
import { useBasket } from "@/hooks/useBasket";
import { Product } from "@/types/product";

export default function ProductPage() {
  const { goBack } = useNavigation();

  const { id } = useLocalSearchParams<"/(app)/products/[id]">();
  const { addProduct, removeProduct, products } = useBasket();

  const [product, setProduct] = useState<Product | undefined>(undefined);
  const { categoriesList, comment, image, kilocalories, name, nutriscore, preparation, price, type, weight } =
    product || {};

  useEffect(() => {
    setProduct(products.find((p) => p.id === id));
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
          <Image className="w-full h-52 bg-gray-300 dark:bg-neutral-800" source={image as ImageSourcePropType} />
          <View className="absolute px-2 py-1 top-2 left-2" style={{ backgroundColor: categoriesList?.[0].hexaColor }}>
            <Text className="text-sm text-black">
              {categoriesList?.[0].icon + " "}
              {categoriesList?.[0].libelle}
            </Text>
          </View>
          <View className="absolute px-2 py-1 bg-gray-100 bottom-2 right-2">
            <Text className="text-sm font-bold text-black">{price}</Text>
          </View>
        </View>
        <View className="flex flex-row items-center justify-between w-full">
          <Text className="text-2xl font-bold text-white">{name}</Text>

          <MaterialCommunityIcons name="chat-question" size={24} color="white" />
        </View>
        <View className="w-full">
          <Text className="text-[14px] text-justify text-white">{comment}</Text>
        </View>
        <View className="flex flex-row items-center justify-around w-full p-4 bg-neutral-800">
          <View className="flex flex-col items-center justify-between w-full">
            <Text className="text-2xl font-bold text-white">{weight}</Text>
            <Text className="text-sm text-white">poids net</Text>
          </View>
          <View className="flex flex-col items-center justify-between w-full">
            <Text className="text-2xl font-bold text-white">{kilocalories}</Text>
            <Text className="text-sm text-white">pour 100g</Text>
          </View>
          <View className="flex flex-col items-center justify-between w-full">
            <Image className="w-16 h-8" source={require("@/assets/images/nutri-c.png")} />
          </View>
        </View>
        <View className="flex flex-row w-full space-x-4">
          <View className="">
            <Button onPress={() => goBack()} icon="close" type="secondary" />
          </View>
          <View className="grow">
            <Button onPress={() => addProduct(id, 1)} title="Je prends ça" />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
