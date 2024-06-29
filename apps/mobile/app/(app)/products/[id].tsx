import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BasketHeader } from "@/components/basket/header";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/ui/header";
import { useBasket } from "@/hooks/useBasket";
import { toPrice } from "@/lib/product/toPrice";
import { Product } from "@/types/product";

export default function ProductPage() {
  const { goBack } = useNavigation();

  // @ts-ignore
  const { id } = useLocalSearchParams<"/(app)/products/[id]">();
  const { addProduct, products } = useBasket();

  const [product, setProduct] = useState<Product | undefined>(undefined);
  const { categoriesList, comment, image, kilocalories, name, price, canMake, weight } = product || {};

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
          <Image
            className="w-full bg-gray-300 h-52 dark:bg-neutral-800"
            source={{
              uri: image,
            }}
          />
          <View className="absolute flex flex-row space-x-2 top-2 left-2">
            {categoriesList?.map((category, index) => {
              return (
                <View key={index} className="px-2 py-1 " style={{ backgroundColor: category.hexaColor }}>
                  <Text className="text-sm text-black">
                    {category.icon + " "}
                    {category.libelle}
                  </Text>
                </View>
              );
            })}
          </View>

          <View className="absolute px-2 py-1 bg-gray-100 bottom-2 right-2">
            <Text className="text-sm font-bold text-black">{toPrice(price || "0")}</Text>
          </View>
          {canMake &&
            (canMake > 0 ? (
              <View className="absolute px-2 py-1 bg-gray-100 bottom-2 left-2">
                <Text className="text-sm font-bold text-black">Disponible</Text>
              </View>
            ) : (
              <View className="absolute px-2 py-1 bg-red-100 bottom-2 left-2">
                <Text className="text-sm font-bold text-red-700">Indisponible</Text>
              </View>
            ))}
        </View>
        <View className="flex flex-row items-center justify-between w-full">
          <Text className="text-2xl font-bold text-white">{name}</Text>

          <MaterialCommunityIcons name="chat-question" size={24} color="white" />
        </View>
        <View className="w-full h-full max-h-36">
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
            <Button
              onPress={() => {
                addProduct(id, 1);
                goBack();
              }}
              title="Je prends ça"
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
