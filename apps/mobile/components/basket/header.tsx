import { useBasket } from "@/hooks/basket";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export const BasketHeader = () => {
  const { total } = useBasket();
  return (
    <View
      key={"basket"}
      className="flex flex-row justify-between items-center px-4 w-full bg-[#8CFFD9]/50 h-14"
    >
      <View className="flex flex-row items-center">
        <MaterialCommunityIcons
          // outline

          name="basket"
          size={24}
          color="black"
        />
        <Text className="ml-2 text-2xl font-bold text-black uppercase">
          Panier
        </Text>
      </View>
      <View className="bg-[#B6E8D8] h-8 px-2 flex items-center justify-center">
        <Text className="text-xl font-bold text-[#008D5E]">
          {total?.toFixed(2).replace(".", "€")}
        </Text>
      </View>
    </View>
  );
};
