import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useRef } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import Toast from "react-native-root-toast";

import { RestaurantCard } from "@/components/restaurant/card";
import { useAuth } from "@/hooks/useAuth";
import { useBasket } from "@/hooks/useBasket";
import { useLocation } from "@/hooks/useLocation";
import { isOpenNow } from "@/lib/restaurant";

export const UserLocation = () => {
  const refRBSheet = useRef<RBSheet>(null);

  const { user } = useAuth();
  const { restaurants } = useLocation();
  const { isBasketEmpty, eta, selectedRestaurantId, selectedRestaurant, selectRestaurant } = useBasket();

  return (
    <>
      <TouchableOpacity
        onPress={() => refRBSheet.current?.open()}
        className="flex flex-row items-center justify-between grow"
      >
        <View className="flex flex-col justify-start px-4">
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

          {selectedRestaurant && isOpenNow(selectedRestaurant?.openinghoursList) ? (
            <>
              {!isBasketEmpty && eta ? (
                <Text className="text-xs text-black/60">Arivée prévue : {eta}</Text>
              ) : (
                <Text className="text-xs text-black/60">Passez votre commande</Text>
              )}
            </>
          ) : (
            <Text className="text-xs text-red-500">Fermé: ({selectedRestaurant?.openinghoursList.join(" / ")})</Text>
          )}
        </View>
        <MaterialCommunityIcons name="chevron-down" size={24} color="black" />
      </TouchableOpacity>

      {/* @ts-ignore */}
      <RBSheet ref={refRBSheet} closeOnDragDown closeOnPressMask height={600}>
        <View className="absolute flex items-center flex-1 w-full h-full p-4 pt-6 bg-black">
          <Text className="flex items-center justify-between pb-6 text-lg font-bold text-white">
            Adresse de livraison
          </Text>
          <Link
            href="(app)/users/change-address"
            className="flex flex-row items-center w-full text-sm text-left text-white "
            onPress={() => refRBSheet.current?.close()}
          >
            <View className="flex flex-row items-center w-full gap-2 ">
              <MaterialCommunityIcons name="map-marker" size={24} color="white" />
              <View className="flex flex-col gap-1 grow">
                <Text className="text-sm text-white">{user?.mainaddress.street}</Text>
                <Text className="text-xs text-white/60">{`${user?.mainaddress.zipcode}, ${user?.mainaddress.country}`}</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={24} color="white" />
            </View>
          </Link>
          <View className="w-full h-px my-6 bg-neutral-800" />
          {restaurants.length > 0 && (
            <>
              <Text className="flex items-center justify-between pb-6 text-lg font-bold text-white">
                Choisir un restaurant
              </Text>
              <FlatList
                className="flex-grow w-full h-64 shrink-0"
                data={restaurants.sort((a, b) =>
                  isOpenNow(a.openinghoursList) === isOpenNow(b.openinghoursList)
                    ? 0
                    : isOpenNow(a.openinghoursList)
                    ? -1
                    : 1,
                )}
                renderItem={({ item }) => (
                  <RestaurantCard
                    restaurant={item}
                    onClick={() => {
                      if (!isOpenNow(item.openinghoursList))
                        Toast.show("Le restaurant est fermé", {
                          position: Toast.positions.TOP,
                          containerStyle: { backgroundColor: "red", zIndex: 9999 },
                        });
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
