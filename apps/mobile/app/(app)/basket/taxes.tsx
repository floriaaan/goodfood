import { Text, View } from "react-native";

import { useBasket } from "@/hooks/useBasket";
import { toPrice } from "@/lib/product/toPrice";

export const BasketTaxes = () => {
  const { taxes } = useBasket();
  return (
    <View className="flex flex-col w-full h-full">
      <View className="flex flex-row justify-between items-center px-1 bg-[#8CFFD9]/50 h-9">
        <Text className="font-bold ml-2 text-[#008D5E]">Livraison</Text>
        <View className="bg-[#B6E8D8] h-6 px-2 flex items-center justify-center">
          <Text className=" font-bold text-[#008D5E]">
            {taxes.delivery > 0 ? toPrice(taxes.delivery) : "On vous l'offre"}
          </Text>
        </View>
      </View>
      <View className="flex flex-row justify-between items-center px-1 bg-[#8CFFD9]/50 h-9">
        <Text className="font-bold ml-2 text-[#008D5E]">Frais de service</Text>
        <View className="bg-[#B6E8D8] h-6 px-2 flex items-center justify-center">
          <Text className=" font-bold text-[#008D5E]">
            {taxes.service > 0 ? toPrice(taxes.service) : "On vous l'offre"}
          </Text>
        </View>
      </View>
    </View>
  );
};
