import { useEffect, useRef, useState } from "react";
import { FlatList, Text, Touchable, TouchableOpacity, View } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";

import { RestaurantCard } from "@/components/restaurant/card";
import { useLocation } from "@/hooks/useLocation";
import { useBasket } from "@/hooks/useBasket";
import { useAuth } from "@/hooks/useAuth";
import { MaterialCommunityIcons } from "@expo/vector-icons";

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

      <RBSheet ref={refRBSheet} closeOnDragDown closeOnPressMask>
        <View className="absolute flex items-center flex-1 w-full h-full bg-white">
          {/*<TouchableOpacity*/}
          {/*  className="flex flex-row items-center justify-center w-full h-12 mr-2 bg-black/5"*/}
          {/*  onPress={refresh}*/}
          {/*>*/}
          {/*  <MaterialCommunityIcons name="crosshairs-gps" color="black" size={24} />*/}
          {/*  <Text> Utiliser ma position</Text>*/}
          {/*</TouchableOpacity>*/}

          {restaurants.length > 0 && (
            <>
              <Text className="flex items-center justify-between text-lg font-bold pt-2">Choisir un restaurant</Text>
              <FlatList
                className="flex-grow w-full shrink-0"
                data={restaurants}
                renderItem={({ item }) => (
                  <RestaurantCard
                    restaurant={item}
                    onClick={() => refRBSheet.current?.close()}
                    selected={selectedRestaurantId === item.id}
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
