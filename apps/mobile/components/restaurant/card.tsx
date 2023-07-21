import { restaurantList } from "@/constants/data";
import { useNative } from "@/hooks/native";
import { calculateDistance } from "@/libs/distance";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import classNames from "classnames";
import { Image, Text, TouchableOpacity, View } from "react-native";

export const RestaurantCard = (props: (typeof restaurantList)[number]) => {
  const { location } = useNative();
  return (
    <TouchableOpacity className="flex flex-col p-3 mb-3 bg-neutral-900">
      <View className="flex flex-row justify-between w-full">
        <View className="flex flex-row propss-center">
          <Image
            className="w-24 h-6"
            source={require("@/assets/images/logo-text.png")}
          />
          <Text className="ml-1 font-bold text-white">{props.name}</Text>
        </View>
        {location && (
          <View className="flex flex-row propss-center">
            <MaterialCommunityIcons name="map-marker" size={12} color="white" />
            <Text className="text-xs text-white">
              {calculateDistance(
                [location?.coords.latitude, location?.coords.longitude],
                props.coordinates as [number, number]
              ).toFixed(2) + " km"}
            </Text>
          </View>
        )}
      </View>
      <View className="flex flex-row mt-1 propss-center">
        <View
          className={classNames("w-2 h-2 mr-2 rounded-full", "bg-green-500")}
        ></View>
        <Text className="text-xs text-white">{props.opening_hours}</Text>
      </View>
    </TouchableOpacity>
  );
};
