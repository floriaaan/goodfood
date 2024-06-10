import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image, ImageSourcePropType, Text, TouchableOpacity, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";

import { useBasket } from "@/hooks/useBasket";
import { toPrice } from "@/lib/product/toPrice";
import { Product } from "@/types/product";

export const ProductBasketCard = ({ id, name, price, image }: Product) => {
  const { addProduct, basket, removeProduct } = useBasket();
  const item = basket.productsList.filter((p) => p.id === id)[0];
  return (
    item && (
      <Swipeable renderRightActions={() => <RightAction id={id} />}>
        <View className="flex flex-row items-center justify-between w-full h-20 pr-2 bg-neutral-100">
          <Image source={image as ImageSourcePropType} className="w-20 h-20" />
          <View className="flex flex-col justify-between h-full pt-1 pb-2 ml-2 grow">
            <View className="flex flex-row items-center justify-between">
              <Text className="text-lg font-bold text-black">{name}</Text>
              <Text className="text-sm text-black">{toPrice(price)}</Text>
            </View>
            <View className="flex flex-row items-center ml-auto space-x-2">
              <TouchableOpacity onPress={() => removeProduct(id, 1)} className="p-2 border border-neutral-500">
                <MaterialCommunityIcons name="minus" size={16} color="black" />
              </TouchableOpacity>
              <View className="flex items-center justify-center p-2 border border-neutral-300">
                <Text className="w-4 h-4 text-[14px] font-bold text-center text-black">{item.quantity}</Text>
              </View>
              <TouchableOpacity onPress={() => addProduct(id, 1)} className="p-2 border border-neutral-500">
                <MaterialCommunityIcons name="plus" size={16} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Swipeable>
    )
  );
};

const RightAction = ({ id }: { id: Product["id"] }) => {
  const { removeProduct, basket } = useBasket();
  return (
    <View className="flex flex-row justify-center w-20 h-full px-4 bg-red-100">
      <View className="flex flex-row justify-center w-screen h-full px-4 bg-red-100">
        <TouchableOpacity
          onPress={() => removeProduct(id, basket.productsList.filter((p) => p.id === id)[0].quantity || 0)}
          className="flex items-center justify-center w-20 h-full"
        >
          <MaterialCommunityIcons name="delete" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
