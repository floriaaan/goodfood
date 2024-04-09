import { useEffect, useRef, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";

import { RestaurantCard } from "@/components/restaurant/card";
import { useLocation } from "@/hooks/useLocation";
import { useBasket } from "@/hooks/useBasket";

export const UserLocation = () => {
  const refRBSheet = useRef<RBSheet>(null);
  const { restaurants } = useLocation();
  const { selectedRestaurantId, address, eta, selectedRestaurant } = useBasket();
  const [addressDisplayed, setAddressDisplayed] = useState("Ajouter une adresse");
  useEffect(() => {
    if (address) setAddressDisplayed(`${address.street}, ${address.zipcode}`);
  }, [address]);
  return (
    <>
      <TouchableOpacity
        onPress={() => (restaurants.length > 0 ? refRBSheet.current?.open() : null)}
        className="flex flex-col"
      >
        <Text className="text-sm font-bold text-black">{addressDisplayed}</Text>
        <Text className="text-xs text-black/60">mercredi 18 janvier - 12:15 - 12:35</Text>
      </TouchableOpacity>
      {restaurants.length > 0 && (
        <RBSheet ref={refRBSheet} closeOnDragDown closeOnPressMask>
          <View className="absolute flex items-center flex-1 w-full h-full bg-white">
            <FlatList
              className="flex-grow w-full shrink-0"
              data={restaurants}
              renderItem={({ item }) => <RestaurantCard restaurant={item} sheetRef={refRBSheet} />}
            />
          </View>
        </RBSheet>
      )}
    </>
  );
};
