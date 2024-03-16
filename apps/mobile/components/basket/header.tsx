import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

import { useBasket } from "@/hooks/useBasket";
import { toPrice } from "@/lib/product/toPrice";

export const BasketHeader = () => {
  const { total } = useBasket();
  const { navigate } = useNavigation() as {
    navigate: (href: string, params?: any) => void;
  };

  return (
    <TouchableOpacity
      onPress={() => navigate("(app)", { screen: "basket" })}
      key="basket"
      className="flex flex-row justify-between items-center px-4 w-full bg-[#8CFFD9]/50 h-14"
    >
      <View className="flex flex-row items-center">
        <MaterialCommunityIcons
          // outline

          name="basket"
          size={24}
          color="black"
        />
        <Text className="ml-2 text-2xl font-bold text-black uppercase">Panier</Text>
      </View>
      <View className="bg-[#B6E8D8] h-8 px-2 flex items-center justify-center">
        <Text className="text-xl font-bold text-[#008D5E]">{toPrice(total)}</Text>
      </View>
    </TouchableOpacity>
  );
};
