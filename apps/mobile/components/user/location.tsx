import { useRef } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";

import { RestaurantCard } from "@/components/restaurant/card";
import { useLocation } from "@/hooks/useLocation";

export const UserLocation = () => {
  const refRBSheet = useRef<RBSheet>(null);
  const { restaurants } = useLocation();

  return (
    <>
      <TouchableOpacity onPress={() => refRBSheet.current?.open()} className="flex flex-col">
        <Text className="text-sm font-bold text-black">24 rue Émile Zola - 76100 Rouen</Text>
        <Text className="text-xs text-black/60">mercredi 18 janvier - 12:15 - 12:35</Text>
      </TouchableOpacity>
      <RBSheet ref={refRBSheet} closeOnDragDown closeOnPressMask>
        <View className="absolute flex items-center flex-1 w-full h-full bg-white">
          <FlatList
            className="flex-grow w-full shrink-0"
            data={restaurants}
            renderItem={({ item }) => <RestaurantCard {...item} />}
          />
        </View>
      </RBSheet>
    </>
  );
};
