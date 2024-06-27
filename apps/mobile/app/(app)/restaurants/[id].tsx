import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { BlurView } from "expo-blur";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Image, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/ui/header";
import { useBasket } from "@/hooks/useBasket";
import { useLocation } from "@/hooks/useLocation";
import { fetchAPI } from "@/lib/fetchAPI";
import { Product } from "@/types/product";
import { Restaurant } from "@/types/restaurant";

export default function RestaurantPage() {
  // @ts-ignore
  const { id } = useLocalSearchParams<"/(app)/restaurants/[id]">();
  const { restaurants } = useLocation();
  const { selectRestaurant } = useBasket();

  const [restaurant, setRestaurant] = useState<Restaurant | undefined>(undefined);

  useEffect(() => {
    setRestaurant(restaurants.find((r) => r.id === id));
  }, [id]);

  const { address: restaurant_address } = restaurant || {};
  const restaurant_location: [number, number] =
    restaurant_address?.lat !== undefined && restaurant_address?.lng !== undefined
      ? [restaurant_address.lat, restaurant_address.lng]
      : [0, 0];

  const { data: api_products } = useQuery<Product[]>({
    queryKey: ["product", "restaurant", id],
    queryFn: async () => {
      const res = await fetchAPI(`/api/product/by-restaurant/${id}`, undefined);
      const body = await res.json();
      return body.productsList;
    },
    enabled: !!id,
    placeholderData: [],
  });
  const products = useMemo(() => api_products ?? [], [api_products]);

  return (
    <View style={{ flex: 1, height: "100%", width: "100%", position: "relative" }}>
      <MapView
        userInterfaceStyle="light"
        style={{ flex: 1, height: "100%", width: "100%" }}
        region={{
          latitude: restaurant_location[0] - 0.0025,
          longitude: restaurant_location[1],
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {!restaurant_location.every(isNaN) && (
          <Marker
            coordinate={{
              latitude: restaurant_location[0],
              longitude: restaurant_location[1],
            }}
            title={restaurant?.name}
          >
            <Image source={require("@/assets/images/restaurant_icon.png")} style={{ width: 26, height: 26 }} />
          </Marker>
        )}
      </MapView>
      <BlurView
        intensity={300}
        className="absolute top-0 flex items-center justify-center w-full px-6 pt-[71px] pb-4 shadow-2xl"
        tint="light"
      >
        <AppHeader hasBackButton />
      </BlurView>
      <BlurView
        intensity={300}
        tint="light"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: 24,
          flexDirection: "column",
          gap: 16,
          paddingBottom: 48,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8, gap: 8 }}>
          <MaterialCommunityIcons name="silverware-fork-knife" size={24} color="black" />
          <View style={{ flexDirection: "column", gap: 4 }}>
            <Text style={{ color: "black", fontSize: 16, fontWeight: "700" }}>Restaurant</Text>
            <Text style={{ color: "black", fontSize: 12 }}>{`${restaurant?.name}`}</Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8, gap: 8 }}>
          <MaterialCommunityIcons name="map-marker" size={24} color="black" />
          <View style={{ flexDirection: "column", gap: 4 }}>
            <Text style={{ color: "black", fontSize: 16, fontWeight: "700" }}>Adresse</Text>
            <Text
              style={{ color: "black", fontSize: 12 }}
            >{`${restaurant_address?.street} ${restaurant_address?.zipcode} ${restaurant_address?.city}`}</Text>
          </View>
        </View>

        {restaurant?.phone && (
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8, gap: 8 }}>
            <MaterialCommunityIcons name="phone" size={24} color="black" />
            <View style={{ flexDirection: "column", gap: 4 }}>
              <Text style={{ color: "black", fontSize: 16, fontWeight: "700" }}>Téléphone</Text>
              <Text style={{ color: "black", fontSize: 12 }}>{`${restaurant?.phone}`}</Text>
            </View>
          </View>
        )}

        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8, gap: 8 }}>
          <MaterialCommunityIcons name="clock" size={24} color="black" />
          <View style={{ flexDirection: "column", gap: 4 }}>
            <Text style={{ color: "black", fontSize: 16, fontWeight: "700" }}>Horaires</Text>
            <Text style={{ color: "black", fontSize: 12 }}>{`${restaurant?.openinghoursList.join(" / ")}`}</Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 8, gap: 8 }}>
          <MaterialCommunityIcons name="food" size={24} color="black" />
          <View style={{ flexDirection: "column", gap: 4 }}>
            <Text style={{ color: "black", fontSize: 16, fontWeight: "700" }}>Produits</Text>
            <Text style={{ color: "black", fontSize: 12 }}>{`${products.length} produits au catalogue`}</Text>
          </View>
        </View>
        <Button
          title="Sélectionner"
          onPress={() => {
            selectRestaurant(id);
            router.push("(app)/home");
          }}
        />
      </BlurView>
    </View>
  );
}
