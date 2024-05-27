import { MaterialCommunityIcons } from "@expo/vector-icons";
import classNames from "classnames";
import { Image, Text, TouchableOpacity, View } from "react-native";

import { useNative } from "@/hooks/useNative";
import { calculateDistance } from "@/lib/distance";
import { useBasket } from "@/hooks/useBasket";
import { Restaurant } from "@/types/restaurant";

interface CardProps {
  restaurant: Restaurant;
  onClick: () => void;
  selected?: boolean;
}

export const RestaurantCard = (props: CardProps) => {
  const { restaurant, onClick, selected } = props;
  const { location } = useNative();
  const { selectRestaurant } = useBasket();
  if (!restaurant) return null;
  return (
    <TouchableOpacity
      className={classNames("flex flex-col p-3 mb-3 bg-neutral-900", selected && "border-2 border-green-500")}
      onPress={() => {
        onClick();
        selectRestaurant(restaurant.id);
      }}
    >
      <View className="flex flex-row justify-between w-full">
        <View className="flex flex-row propss-center">
          <Image className="w-24 h-6" source={require("@/assets/images/logo-text.png")} />
          <Text className="flex-shrink-0 ml-1 font-bold text-white flex-nowrap grow">{restaurant.name}</Text>
        </View>
        {location && (
          <View className="flex flex-row propss-center">
            <MaterialCommunityIcons name="map-marker" size={12} color="white" />
            <Text className="text-xs text-white">
              {calculateDistance([location?.coords.latitude, location?.coords.longitude], [
                restaurant.address.lat,
                restaurant.address.lng,
              ] as [number, number]).toFixed(2) + " km"}
            </Text>
          </View>
        )}
      </View>
      <View className="flex flex-row mt-1 propss-center">
        <View className={classNames("w-2 h-2 mr-2 rounded-full", "bg-green-500")} />
        <Text className="text-xs text-white">{restaurant.openinghoursList.join(" / ")}</Text>
      </View>
    </TouchableOpacity>
  );
};