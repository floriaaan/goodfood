import { Product } from "@/types/product";
import { useNavigation } from "expo-router";
import {
  Image,
  ImageSourcePropType,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export const ProductCard = (props: Product) => {
  const { navigate } = useNavigation() as {
    navigate: (href: string, params?: any) => void;
  };
  return (
    <TouchableOpacity
      // don't transparent on press
      // activeOpacity={0.8}
      key={props.id}
      className="relative flex flex-col mr-4 w-52"
      onPress={() =>
        navigate("(app)", { screen: "products/[id]", params: { id: props.id } })
      }
    >
      <Image
        className="w-full h-28"
        source={props.image as ImageSourcePropType}
      />
      <View
        className="absolute top-2 left-2 px-1 py-0.5"
        style={{ backgroundColor: props.categories[0].hexa_color }}
      >
        <Text className="text-xs text-black">
          {props.categories[0].icon + " "}
          {props.categories[0].libelle}
        </Text>
      </View>
      <View className="absolute top-[88px] right-2 px-1 py-0.5 bg-gray-100">
        <Text className="text-xs font-bold text-black">
          {props.price.toFixed(2).replace(".", "€")}
        </Text>
      </View>

      <View className="p-3 bg-white border-t border-black">
        <Text className="font-bold text-black" numberOfLines={1}>
          {props.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
