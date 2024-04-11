import { useBasket } from "@/hooks/useBasket";
import { toPrice } from "@/lib/product/toPrice";

import { View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export const BasketTaxes = () => {
  const { taxes } = useBasket();
  return (
    <View className="flex flex-col h-full w-full">
      <View className="flex flex-row justify-between items-center px-4 bg-[#8CFFD9]/50 h-9">
        <Text className="ml-2 font-bold text-[#008D5E]">Livraison</Text>
        <View className="bg-[#B6E8D8] h-6 px-2 flex items-center justify-center">
          <Text className="text-l font-bold text-[#008D5E]">
            {taxes.delivery > 0 ? toPrice(taxes.delivery) : "On vous l'offre"}
          </Text>
        </View>
      </View>
      <View className="flex flex-row justify-between items-center px-4 bg-[#8CFFD9]/50 h-9">
        <Text className="ml-2 font-bold text-[#008D5E]">Frais de service</Text>
        <View className="bg-[#B6E8D8] h-6 px-2 flex items-center justify-center">
          <Text className="text-l font-bold text-[#008D5E]">
            {taxes.service > 0 ? toPrice(taxes.service) : "On vous l'offre"}
          </Text>
        </View>
      </View>
    </View>
  );
};
