import { Link, useLocalSearchParams, useNavigation } from "expo-router";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import MapViewDirections from "react-native-maps-directions";
import { useEffect, useMemo, useState } from "react";
import { orderList } from "@/constants/data";
import { DeliveryType, Order } from "@/types/order";
import MapView, { Marker, UrlTile } from "react-native-maps";
import { useNative } from "@/hooks/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { format } from "date-fns";
import { PaymentStatus } from "@/types/payment";

const GOOGLE_MAPS_APIKEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_APIKEY || "";

export default function OrderPage() {
  const { navigate } = useNavigation() as {
    navigate: (href: string, params?: any) => void;
  };
  const { id } = useLocalSearchParams<"/(app)/orders/[id]">();

  const [order, setOrder] = useState<Order | undefined>(undefined);
  useEffect(() => {
    setOrder(orderList.find((o) => o.id === id));
  }, [id]);

  const { delivery, delivery_type, payment } = order || {};
  const { person, eta, address } = delivery || {};

  const { location: delivery_location } = person || {
    location: [0, 0],
  };
  const { location } = useNative();
  const user_location =
    location?.coords.latitude && location?.coords.longitude
      ? [location?.coords.latitude, location?.coords.longitude]
      : [0, 0];

  const region = useMemo(() => {
    const delta_lat = Math.abs(user_location[0] - delivery_location[0]);
    const delta_long = Math.abs(user_location[1] - delivery_location[1]);
    return {
      latitude: (user_location[0] + delivery_location[0]) / 2 - delta_lat / 3.5,
      longitude: (user_location[1] + delivery_location[1]) / 2,
      latitudeDelta: delta_lat * 2,
      longitudeDelta: delta_long * 2,
    };
  }, [user_location, delivery_location]);

  return (
    <View className="h-screen w-screen">
      <MapView
        className="w-screen h-screen"
        region={region}
        showsUserLocation
        scrollEnabled={false}
      >
        {Platform.OS === "ios" && (
          <UrlTile
            urlTemplate="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
            maximumZ={19}
            flipY={false}
          />
        )}
        <Marker
          coordinate={{
            latitude: delivery_location[0],
            longitude: delivery_location[1],
          }}
          title="Delivery Person"
        />
        <MapViewDirections
          destination={{
            latitude: user_location[0],
            longitude: user_location[1],
          }}
          origin={{
            latitude: delivery_location[0],
            longitude: delivery_location[1],
          }}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={5}
          strokeColor="#008D5E"
        />
      </MapView>
      <TouchableOpacity
        onPress={() => navigate(`(app)`, { screen: "orders/index" })}
        className="absolute top-12 left-0 flex items-center justify-center w-12 h-12 p-2 m-4 bg-black"
      >
        <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
      </TouchableOpacity>
      <View className="absolute bottom-0 left-0 w-screen bg-black h-64 flex flex-col gap-y-6 px-4">
        {eta && (
          <Text className="text-white text-xl font-bold">{`Arrivée prévue à ${format(
            new Date(eta),
            "HH:mm"
          )}`}</Text>
        )}
        <View className="flex flex-row items-center gap-x-4">
          <MaterialCommunityIcons name="walk" size={24} color="white" />
          <View className="flex flex-col gap-y-1">
            <Text className="text-white font-bold">
              {delivery_type === DeliveryType.DELIVERY
                ? "Je fais livrer ma commande"
                : "Je vais chercher ma commande"}
            </Text>
            <Text className="text-white">{address}</Text>
          </View>
        </View>
        <View className="flex flex-row items-center gap-x-4">
          <MaterialCommunityIcons
            name={
              payment?.status === PaymentStatus.APPROVED
                ? "basket-check-outline"
                : "basket-remove-outline"
            }
            size={24}
            color="white"
          />
          <View className="flex flex-col gap-y-1">
            <Text className="text-white font-bold">
              {payment?.status === PaymentStatus.APPROVED
                ? `La commande ${id} a été payée`
                : "La commande n'a pas encore été payée"}
            </Text>
            <Link
              href={`/(app)/orders/${id}`}
              className="w-full items-center flex flex-row"
            >
              <Text className="text-white underline mr-2">Voir le détail</Text>
              <MaterialCommunityIcons
                name="arrow-right"
                size={12}
                color="white"
              />
            </Link>
          </View>
        </View>
      </View>
    </View>
  );
}
