import { BasketHeader } from "@/components/basket/header";
import { ProductBasketCard } from "@/components/product/basket";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/ui/header";
import { productList } from "@/constants/data";
import { useBasket } from "@/hooks/basket";
import { Product } from "@/types/product";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Basket() {
  const { basket } = useBasket();
  const basketProductList = Object.keys(basket).map(
    (id) => productList.find((product) => product.id === id) as Product
  );
  const { goBack } = useNavigation();
  return (
    <View className="relative flex flex-col justify-between w-screen h-screen p-6 pb-16 bg-white">
      <View className="absolute bottom-0 left-0 w-screen bg-black h-28"></View>
      <SafeAreaView className="flex flex-col w-full h-full gap-4">
        <View className="w-full">
          <AppHeader />
        </View>
        <View className="w-full">
          <BasketHeader />
        </View>
        <View className="w-full">
          <FlatList
            className="grow"
            data={basketProductList}
            renderItem={({ item }) => <ProductBasketCard {...item} />}
            ItemSeparatorComponent={() => <View className="h-2" />}
            ListFooterComponent={() => (
              <View className="w-full">
                <Text className="text-center text-black ">
                  Footer
                </Text>
              </View>
            )}
          />
        </View>
        <View className="absolute bottom-0">
          <View className="flex flex-row w-full space-x-4">
            <View className="">
              <Button onPress={() => goBack()} icon="home" type="secondary" />
            </View>
            <View className="grow">
              <Button
                icon="arrow-right"
                onPress={() => console.log("next step")}
                title="Étape suivante"
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
