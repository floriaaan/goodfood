import { useEffect, useRef, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";

import { RestaurantCard } from "@/components/restaurant/card";
import { useAuth } from "@/hooks/useAuth";
import { useBasket } from "@/hooks/useBasket";
import { useLocation } from "@/hooks/useLocation";

export const UserLocation = () => {
  const refRBSheet = useRef<RBSheet>(null);
  const { restaurants, refresh } = useLocation();
  const { address, isBasketEmpty, eta, selectedRestaurantId } = useBasket();
  const { user } = useAuth();
  const [addressDisplayed, setAddressDisplayed] = useState("Ajouter une adresse");
  useEffect(() => {
    if (address?.street && address?.zipcode) {
      setAddressDisplayed(`${address.street}, ${address.zipcode}`);
    } else {
      setAddressDisplayed(`${user?.mainaddress.street}, ${user?.mainaddress.zipcode}`);
    }
  }, [address]);
  return (
    <>
      <TouchableOpacity
        onPress={() => (restaurants.length > 0 ? refRBSheet.current?.open() : null)}
        className="flex flex-col"
      >
        <Text className="text-sm font-bold text-black">{addressDisplayed}</Text>
        {!isBasketEmpty && eta ? (
          <Text className="text-xs text-black/60">{eta}</Text>
        ) : (
          <Text className="text-xs text-black/60">Passez votre commande</Text>
        )}
      </TouchableOpacity>

      {/* @ts-ignore */}
      <RBSheet ref={refRBSheet} closeOnDragDown closeOnPressMask height={320}>
        <View className="absolute flex items-center flex-1 w-full h-full p-4 pt-6 bg-neutral-800">
          {restaurants.length > 0 && (
            <>
              <Text className="flex items-center justify-between pb-6 text-lg font-bold text-white">
                Choisir un restaurant
              </Text>
              <FlatList
                className="flex-grow w-full h-64 shrink-0"
                data={restaurants}
                renderItem={({ item }) => (
                  <RestaurantCard
                    restaurant={item}
                    onClick={() => refRBSheet.current?.close()}
                    selected={selectedRestaurantId === item.id}
                    className="bg-neutral-100"
                  />
                )}
              />
            </>
          )}
        </View>
      </RBSheet>
    </>
  );
};
