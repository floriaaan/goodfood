import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useMemo } from "react";
import { Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { orderList } from "@/constants/data";
import { useNative } from "@/hooks/useNative";
import { PaymentStatus } from "@/types/payment";

const GOOGLE_MAPS_APIKEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_APIKEY || "";

export default function OrderIdScreen() {
  const { navigate } = useNavigation() as {
    navigate: (href: string, params?: any) => void;
  };
  const { id } = useLocalSearchParams<"/(app)/order/[id]">();
  const order = orderList.find((order) => order.id === id);

  const { delivery, deliveryType, payment } = order || {};
  const { deliveryPerson, eta, address } = delivery || {};

  const { address: delivery_address } = deliveryPerson || {};
  const delivery_location = [
    delivery_address?.lat || NaN,
    delivery_address?.lng || NaN,
  ];
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
    <View style={{ flex: 1, height: "100%", width: "100%" }}>
      <MapView
        style={{ flex: 1, height: "100%", width: "100%" }}
        region={region}
        showsUserLocation
      >
        {/* {Platform.OS === "ios" && (
            <UrlTile
              urlTemplate="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
              maximumZ={19}
              flipY={false}
            />
          )} */}
        <Marker
          coordinate={{
            latitude: delivery_location[0],
            longitude: delivery_location[1],
          }}
          title="Delivery Person"
        />
        {/* <MapViewDirections
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
        /> */}
      </MapView>
      <Header hasBackButton />

      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: 16,
          backgroundColor: "black",
          flexDirection: "column",
          gap: 16,
          paddingBottom: 48,
          

        }}
      >
        {eta && (
          <Text style={{ color: "white" }}>{`Arrivée prévue à ${
            new Date(eta).toLocaleString("fr-FR", {
              hour: "numeric",
              minute: "numeric",
            }) || "calcul en cours..."
          }`}</Text>
        )}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 8,
            gap: 8,
          }}
        >
          <MaterialCommunityIcons name="walk" size={24} color="white" />
          <View
            style={{
              flexDirection: "column",
              gap: 4,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 16,
                fontWeight: "700",
              }}
            >
              Commande à livrer
            </Text>
            <Text
              style={{
                color: "white",
                fontSize: 12,
              }}
            >{`${address?.street} ${address?.zipcode} ${address?.city}`}</Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          <MaterialCommunityIcons
            name={
              payment?.status === PaymentStatus.APPROVED
                ? "basket-check-outline"
                : "basket-remove-outline"
            }
            size={24}
            color="white"
          />
          <View
            style={{
              flexDirection: "column",
              gap: 4,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 16,
                fontWeight: "700",
              }}
            >
              {payment?.status === PaymentStatus.APPROVED
                ? `La commande a été payée`
                : "La commande n'a pas encore été payée"}
            </Text>
          </View>
        </View>

        <Button
          title="Valider la livraison"
          icon="check"

          onPress={() => console.log("button pressed")}
        />
      </View>
    </View>
  );
}
