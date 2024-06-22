import classNames from "classnames";
import { useNavigation } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

import { Product } from "@/types/product";

export const ProductCard = ({
  width,
  className,
  ...props
}: {
  width?: string;
  className?: string;
} & Product) => {
  const { navigate } = useNavigation() as {
    navigate: (href: string, params?: any) => void;
  };
  return (
    <TouchableOpacity
      key={props.id}
      className={classNames("relative flex flex-col mr-4", width || "w-52", className)}
      onPress={() => navigate("(app)", { screen: "products/[id]", params: { id: props.id } })}
    >
      <Image
        className={classNames("w-full bg-gray-300 dark:bg-gray-800", width ? "aspect-video h-48" : "h-28")}
        source={{
          uri: props.image,
        }}
      />
      {props.categoriesList.length > 0 && (
        <View className="absolute flex flex-row space-x-1 top-2 left-2">
          {props.categoriesList.map((category) => (
            <View key={category.id} style={{ backgroundColor: category.hexaColor }} className="px-1 py-0.5">
              <Text className="text-xs text-black">
                {category.icon + " "}
                {category.libelle}
              </Text>
            </View>
          ))}
        </View>
      )}
      <View className="absolute bottom-12 right-2 px-1 py-0.5 bg-gray-100">
        <Text className="text-xs font-bold text-black">{props.price.toFixed(2).replace(".", "€")}</Text>
      </View>

      <View className="p-3 bg-white border-t border-black">
        <Text className="font-bold text-black" numberOfLines={1}>
          {props.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
