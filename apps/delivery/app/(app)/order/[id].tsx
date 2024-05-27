import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Keyboard, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { useNative } from "@/hooks/useNative";
import { PaymentStatus } from "@/types/payment";

import { useAuth } from "@/hooks/useAuth";
import { useData } from "@/hooks/useData";
import { calculateDistance } from "@/lib/distance";
import { fetchAPI } from "@/lib/fetchAPI";
import { Status } from "@/types/global";
import { Image } from "expo-image";
import Dialog from "react-native-dialog";
import MapViewDirections from "react-native-maps-directions";
import Toast from "react-native-root-toast";

const GOOGLE_MAPS_APIKEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_APIKEY || "";

export default function OrderIdScreen() {
  const { session } = useAuth();
  const { token } = session || {};
  const { navigate, goBack } = useNavigation();
  const { id } = useLocalSearchParams();
  const { orders, isOrdersLoading } = useData();

  const order = orders.find((o) => o.id === id);

  const { delivery, payment, restaurant } = order || {};
  const { eta, address } = delivery || {};

  const address_location: [number, number] =
    address?.lat !== undefined && address?.lng !== undefined
      ? [address.lat, address.lng]
      : [NaN, NaN];

  const { address: restaurant_address } = restaurant || {};
  const restaurant_location: [number, number] =
    restaurant_address?.lat !== undefined &&
    restaurant_address?.lng !== undefined
      ? [restaurant_address.lat, restaurant_address.lng]
      : [NaN, NaN];

  const { location } = useNative();
  const delivery_person_location: [number, number] =
    location?.coords.latitude && location?.coords.longitude
      ? [location?.coords.latitude, location?.coords.longitude]
      : [0, 0];

  const region = useMemo(() => {
    const avg_latitude =
      (delivery_person_location[0] +
        address_location[0] +
        restaurant_location[0]) /
      3;
    const avg_longitude =
      (delivery_person_location[1] +
        address_location[1] +
        restaurant_location[1]) /
      3;

    const delta_lat = Math.max(
      Math.abs(delivery_person_location[0] - address_location[0]),
      Math.abs(delivery_person_location[0] - restaurant_location[0]),
      Math.abs(address_location[0] - restaurant_location[0])
    );

    const delta_long = Math.max(
      Math.abs(delivery_person_location[1] - address_location[1]),
      Math.abs(delivery_person_location[1] - restaurant_location[1]),
      Math.abs(address_location[1] - restaurant_location[1])
    );

    return {
      latitude: avg_latitude - delta_lat / 3.5,
      longitude: avg_longitude,
      latitudeDelta: delta_lat * 2,
      longitudeDelta: delta_long * 2,
    };
  }, [delivery_person_location, address_location, restaurant_location]);

  const [validateDialogVisible, setValidateDialogVisible] = useState(false);
  const [validateCode, setValidateCode] = useState("");

  const [havePassedRestaurant, setHavePassedRestaurant] = useState(false);
  useEffect(() => {
    const distanceToRestaurant = calculateDistance(
      delivery_person_location,
      restaurant_location
    );
    if (distanceToRestaurant < 0.1) setHavePassedRestaurant(true);
  }, [delivery_person_location, restaurant_location]);

  if (isOrdersLoading) return <Text>Loading...</Text>;
  if (!order) return <Text>Order not found</Text>;

  return (
    <View style={{ flex: 1, height: "100%", width: "100%" }}>
      <MapView
        style={{ flex: 1, height: "100%", width: "100%" }}
        region={region}
      >
        {!delivery_person_location.every(isNaN) && (
          <Marker
            coordinate={{
              latitude: delivery_person_location[0],
              longitude: delivery_person_location[1],
            }}
            title="Livreur"
          >
            <Image
              source={require("@/assets/images/delivery_icon.png")}
              style={{ width: 26, height: 26 }}
            />
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
            <Image
              source={require("@/assets/images/user_icon.png")}
              style={{ width: 26, height: 26 }}
            />
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
            <Image
              source={require("@/assets/images/restaurant_icon.png")}
              style={{ width: 26, height: 26 }}
            />
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
        {order.status !== Status.FULFILLED ? (
          eta && (
            <Text
              style={{ color: "white", fontSize: 24, fontWeight: "800" }}
            >{`Arrivée estimée à ${
              new Date(eta).toLocaleString("fr-FR", {
                hour: "numeric",
                minute: "numeric",
              }) || "calcul en cours..."
            }`}</Text>
          )
        ) : (
          <Text style={{ color: "white", fontSize: 24, fontWeight: "800" }}>
            Commande livrée 🧑‍🍳
          </Text>
        )}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 8,
            gap: 8,
          }}
        >
          <MaterialCommunityIcons
            name="silverware-fork-knife"
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
              Commande à aller chercher
            </Text>
            <Text
              style={{
                color: "white",
                fontSize: 12,
              }}
            >{`${restaurant_address?.street} ${restaurant_address?.zipcode} ${restaurant_address?.city}`}</Text>
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
            marginBottom: 16,
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
          disabled={order.status === Status.FULFILLED}
          title="Valider la livraison"
          icon="check"
          onPress={() => setValidateDialogVisible(true)}
        />
      </View>
      <Dialog.Container visible={validateDialogVisible}>
        <Dialog.Title>Valider la commande</Dialog.Title>
        <Dialog.Description>
          Veuiller renseigner le code de validation de la commande
        </Dialog.Description>

        <Dialog.CodeInput
          placeholder="Code de validation"
          value={validateCode}
          onCodeChange={(e) => setValidateCode(e)}
        />
        <Dialog.Button
          onPress={async () => {
            try {
              if (!validateCode) {
                Keyboard.dismiss();
                return Toast.show("Veuillez renseigner un code de validation", {
                  duration: Toast.durations.LONG,
                });
              }

              const res = await fetchAPI(
                `/api/order/claim/${order?.id}`,
                token,
                {
                  method: "PUT",
                  body: JSON.stringify({ code: validateCode }),
                }
              );
              if (!res.ok) throw new Error("Failed to claim order");

              Toast.show("Commande validée avec succès", {
                duration: Toast.durations.LONG,
              });
              setValidateDialogVisible(false);
              goBack();
            } catch (e) {
              console.error(e);
              Toast.show("Une erreur est survenue", {
                duration: Toast.durations.LONG,
              });
            }
          }}
          label="Valider"
          color={"#000"}
        />
        <Dialog.Button
          onPress={() => setValidateDialogVisible(false)}
          label="Annuler"
          color={"#000"}
        />
      </Dialog.Container>
    </View>
  );
}
