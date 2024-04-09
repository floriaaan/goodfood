import { MaterialCommunityIcons } from "@expo/vector-icons";
import classNames from "classnames";
import { Image, Text, TouchableOpacity, View } from "react-native";

import { restaurantList } from "@/constants/data";
import { useNative } from "@/hooks/useNative";
import { calculateDistance } from "@/lib/distance";

export const RestaurantCard = (props: (typeof restaurantList)[number]) => {
  const { location } = useNative();
  return (
    <TouchableOpacity className="flex flex-col p-3 mb-3 bg-neutral-900">
      <View className="flex flex-row justify-between w-full">
        <View className="flex flex-row propss-center">
          <Image className="w-24 h-6" source={require("@/assets/images/logo-text.png")} />
          <Text className="flex-shrink-0 ml-1 font-bold text-white flex-nowrap grow">{props.name}</Text>
        </View>
        {location && (
          <View className="flex flex-row propss-center">
            <MaterialCommunityIcons name="map-marker" size={12} color="white" />
            <Text className="text-xs text-white">
              {calculateDistance([location?.coords.latitude, location?.coords.longitude], [
                props.address.lat,
                props.address.lng,
              ] as [number, number]).toFixed(2) + " km"}
            </Text>
          </View>
        )}
      </View>
      <View className="flex flex-row mt-1 propss-center">
        <View className={classNames("w-2 h-2 mr-2 rounded-full", "bg-green-500")} />
        <Text className="text-xs text-white">{props.openinghoursList.join(" / ")}</Text>
      </View>
    </TouchableOpacity>
  );
};