import { useEffect, useRef, useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";

import { RestaurantCard } from "@/components/restaurant/card";
import { useAuth } from "@/hooks/useAuth";
import { useBasket } from "@/hooks/useBasket";
import { useLocation } from "@/hooks/useLocation";

export const UserLocation = () => {
  const refRBSheet = useRef<RBSheet>(null);
  const { restaurants } = useLocation();
  const { address, isBasketEmpty, eta, selectedRestaurantId, selectedRestaurant, selectRestaurant } = useBasket();
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
        className="flex flex-col justify-start px-4 grow"
      >
        {selectedRestaurant ? (
          <View className="flex flex-row items-center w-full -ml-1">
            <Image className="w-24 h-6 -mt-1" source={require("@/assets/images/logo-text.png")} />
            <Text className="flex-shrink-0 ml-1 -mt-1 text-sm font-bold flex-nowrap grow">
              {selectedRestaurant.name}
            </Text>
          </View>
        ) : (
          <View className="flex flex-row items-center w-full -ml-1">
            <Image className="w-24 h-6 -mt-1" source={require("@/assets/images/logo-text.png")} />
            <Text className="flex-shrink-0 ml-1 -mt-1 text-sm font-bold text-white flex-nowrap grow">
              Choisir un restaurant
            </Text>
          </View>
        )}
        {/* <Text className="text-sm font-bold text-black">{addressDisplayed}</Text> */}

        {!isBasketEmpty && eta ? (
          <Text className="text-xs text-black/60">Arivée prévue : {eta}</Text>
        ) : (
          <Text className="text-xs text-black/60">Passez votre commande</Text>
        )}
      </TouchableOpacity>

      {/* @ts-ignore */}
      <RBSheet ref={refRBSheet} closeOnDragDown closeOnPressMask height={600}>
        <View className="absolute flex items-center flex-1 w-full h-full p-4 pt-6 bg-black">
          <Text className="flex items-center justify-between pb-6 text-lg font-bold text-white">
            Adresse de livraison
          </Text>
          <Text className="text-sm text-white">{addressDisplayed}</Text>
          <View className="w-full h-px my-6 bg-neutral-800" />
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
                    onClick={() => {
                      refRBSheet.current?.close();
                      selectRestaurant(item.id);
                    }}
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
