import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { BlurView } from "expo-blur";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Image, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

import { AppHeader } from "@/components/ui/header";
import { useAuth } from "@/hooks/useAuth";
import { useBasket } from "@/hooks/useBasket";
import { calculateDistance } from "@/lib/distance";
import { fetchAPI } from "@/lib/fetchAPI";
import { Status } from "@/types/global";
import { Order } from "@/types/order";
import { PaymentStatus } from "@/types/payment";

const GOOGLE_MAPS_APIKEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_APIKEY || "";

export default function OrderPage() {
  // @ts-ignore
  const { id } = useLocalSearchParams<"/(app)/orders/[id]/">();

  const { session, isAuthenticated } = useAuth();

  const { data: api_orders, isLoading: isOrdersLoading } = useQuery<Order[]>({
    queryKey: ["order", "user", session?.user?.id],
    queryFn: async () => {
      const res = await fetchAPI(`/api/order/by-user/${session?.user?.id}`, session?.token);
      const body = await res.json();
      console.log(JSON.stringify(body.ordersList[0], null, 2));

      return body.ordersList || [];
    },
    staleTime: 1000 * 60 * 5,
    enabled: isAuthenticated,
  });
  const orders = useMemo(() => api_orders || [], [api_orders]);
  const order = orders.find((order) => order.id === id);

  const { selectedRestaurant: restaurant } = useBasket();
  const { delivery, payment } = order || {};
  const { eta, address } = delivery || {};

  const address_location: [number, number] =
    address?.lat !== undefined && address?.lng !== undefined ? [address.lat, address.lng] : [NaN, NaN];

  const { address: restaurant_address } = restaurant || {};
  const restaurant_location: [number, number] =
    restaurant_address?.lat !== undefined && restaurant_address?.lng !== undefined
      ? [restaurant_address.lat, restaurant_address.lng]
      : [NaN, NaN];

  const delivery_person_location: [number, number] =
    order?.delivery.deliveryPerson.address?.lat && order?.delivery.deliveryPerson.address?.lng
      ? [order?.delivery.deliveryPerson.address?.lat, order?.delivery.deliveryPerson.address?.lng]
      : [0, 0];

  const region = useMemo(() => {
    const avg_latitude = (delivery_person_location[0] + address_location[0] + restaurant_location[0]) / 3;
    const avg_longitude = (delivery_person_location[1] + address_location[1] + restaurant_location[1]) / 3;

    const delta_lat = Math.max(
      Math.abs(delivery_person_location[0] - address_location[0]),
      Math.abs(delivery_person_location[0] - restaurant_location[0]),
      Math.abs(address_location[0] - restaurant_location[0]),
    );

    const delta_long = Math.max(
      Math.abs(delivery_person_location[1] - address_location[1]),
      Math.abs(delivery_person_location[1] - restaurant_location[1]),
      Math.abs(address_location[1] - restaurant_location[1]),
    );

    return {
      latitude: avg_latitude - delta_lat / 3.5,
      longitude: avg_longitude,
      latitudeDelta: delta_lat * 2,
      longitudeDelta: delta_long * 2,
    };
  }, [delivery_person_location, address_location, restaurant_location]);

  const [havePassedRestaurant, setHavePassedRestaurant] = useState(false);
  useEffect(() => {
    const distanceToRestaurant = calculateDistance(delivery_person_location, restaurant_location);
    if (distanceToRestaurant < 0.1) setHavePassedRestaurant(true);
  }, [delivery_person_location, restaurant_location]);

  if (isOrdersLoading) return <Text>Loading...</Text>;
  if (!order) return <Text>Order not found</Text>;

  // convert order id (string) to a number, get the last 4 digits, and compare with code
  const id_as_number = order.id
    .split("")
    .map((char) => char.charCodeAt(0))
    .join("");
  const lastFourDigits = id_as_number.slice(-4);

  return (
    <View style={{ flex: 1, height: "100%", width: "100%" }}>
      <MapView style={{ flex: 1, height: "100%", width: "100%" }} region={region}>
        {!delivery_person_location.every(isNaN) && (
          <Marker
            coordinate={{
              latitude: delivery_person_location[0],
              longitude: delivery_person_location[1],
            }}
            title="Livreur"
          >
            <Image source={require("@/assets/images/delivery_icon.png")} style={{ width: 26, height: 26 }} />
          </Marker>
        )}

        {!address_location.every(isNaN) && (
          <Marker
            coordinate={{
              latitude: address_location[0],
              longitude: address_location[1],
            }}
            title="Utilisateur à livrer"
          >
            <Image source={require("@/assets/images/user_icon.png")} style={{ width: 26, height: 26 }} />
          </Marker>
        )}

        {!restaurant_location.every(isNaN) && (
          <Marker
            coordinate={{
              latitude: restaurant_location[0],
              longitude: restaurant_location[1],
            }}
            title="Restaurant"
          >
            <Image source={require("@/assets/images/restaurant_icon.png")} style={{ width: 26, height: 26 }} />
          </Marker>
        )}

        {!havePassedRestaurant && (
          <MapViewDirections
            origin={{
              latitude: delivery_person_location[0],
              longitude: delivery_person_location[1],
            }}
            destination={{
              latitude: restaurant_location[0],
              longitude: restaurant_location[1],
            }}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={5}
            strokeColor="#008D5E"
            lineJoin="miter"
          />
        )}
        <MapViewDirections
          origin={{
            latitude: restaurant_location[0],
            longitude: restaurant_location[1],
          }}
          destination={{
            latitude: address_location[0],
            longitude: address_location[1],
          }}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={5}
          strokeColor="#F99436"
        />
      </MapView>
      <BlurView
        intensity={300}
        className="absolute top-0 flex items-center justify-center w-full px-4 pt-16 pb-4 shadow-2xl"
      >
        <AppHeader />
      </BlurView>
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
        {order.status !== Status.FULFILLED ? (
          eta && (
            <Text style={{ color: "white", fontSize: 24, fontWeight: "800" }}>{`Arrivée estimée à ${
              new Date(eta).toLocaleString("fr-FR", {
                hour: "numeric",
                minute: "numeric",
              }) || "calcul en cours..."
            }`}</Text>
          )
        ) : (
          <Text style={{ color: "white", fontSize: 24, fontWeight: "800" }}>Commande livrée 🧑‍🍳</Text>
        )}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 8,
            gap: 8,
          }}
        >
          <MaterialCommunityIcons name="silverware-fork-knife" size={24} color="white" />
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
              Commande au restaurant
            </Text>
            <Text
              style={{
                color: "white",
                fontSize: 12,
              }}
            >{`${restaurant?.name}`}</Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 8,
            gap: 8,
          }}
        >
          <MaterialCommunityIcons name="account" size={24} color="white" />
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
              Commande livrée par
            </Text>
            <Text
              style={{
                color: "white",
                fontSize: 12,
              }}
            >{`${delivery?.deliveryPerson.firstName} ${delivery?.deliveryPerson.lastName} (${delivery?.deliveryPerson.phone})`}</Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            marginBottom: 16,
          }}
        >
          <MaterialCommunityIcons
            name={payment?.status === PaymentStatus.APPROVED ? "basket-check-outline" : "basket-remove-outline"}
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

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            marginBottom: 16,
          }}
        >
          <MaterialCommunityIcons name="lock-outline" size={24} color="white" />
          <View
            style={{
              flexDirection: "column",
              gap: 4,
              flexGrow: 1,
            }}
          >
            <Text style={{ color: "white", fontSize: 16, fontWeight: "700" }}>Code de validation</Text>
            <Text style={{ color: "white", fontSize: 48, fontWeight: "900" }}>{lastFourDigits}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
