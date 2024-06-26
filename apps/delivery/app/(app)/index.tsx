import { Header } from "@/components/header";
import { LargeLoader } from "@/components/loader/large";
import { OrderListHeader } from "@/components/order/list-header";
import { OrderListItem } from "@/components/order/list-item";
import { useData } from "@/hooks/useData";
import { useNative } from "@/hooks/useNative";
import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";



const { height } = Dimensions.get("window");
const BOTTOM_PANEL_HEIGHT_MINIMIZED = 350;
const BOTTOM_PANEL_HEIGHT_MAXIMIZED = height - 300;

const MARKER_DIFF_MINIMIZED =
  (3.5 * BOTTOM_PANEL_HEIGHT_MINIMIZED) / height / 100;

const MARKER_DIFF_MAXIMIZED =
  (3.5 * BOTTOM_PANEL_HEIGHT_MAXIMIZED) / height / 100;

const deltas = { latitudeDelta: 0.05, longitudeDelta: 0.05 };

export default function Index() {
  const { location, locationPermission } = useNative();
  const { orders, refetchOrders, isOrdersLoading } = useData();
  const user_location =
    location?.coords.latitude && location?.coords.longitude
      ? [location?.coords.latitude, location?.coords.longitude]
      : [NaN, NaN];

  const mapRef = useRef<MapView | null>(null);

  const [isBottomPanelMaximized, setIsBottomPanelMaximized] = useState(false);

  if (user_location.every(isNaN)) return <LargeLoader />;

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: user_location[0] - MARKER_DIFF_MINIMIZED,
          longitude: user_location[1],
          ...deltas,
        }}
        showsUserLocation
      >
        {orders.map((order) => {
          const {
            delivery: {
              address: { lat, lng },
            },
          } = order;
          return (
            <Marker
              key={order.id}
              coordinate={{ latitude: lat, longitude: lng }}
              title={`Commande pour ${order.user.firstName}`}
              description={`Restaurant: ${order.restaurant?.name}`}
            >
              <Image
                source={require("@/assets/images/user_icon.png")}
                style={{ width: 26, height: 26 }}
              />
            </Marker>
          );
        })}
      </MapView>
      <Header />

      <View style={styles.bottom}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            width: "100%",
            marginBottom: 16,
            marginRight: 16,
            gap: 16,
          }}
        >
          <TouchableOpacity
            style={styles.bottom_maximize_button}
            activeOpacity={0.7}
            onPress={() => {
              if (isBottomPanelMaximized) {
                mapRef.current?.animateToRegion({
                  latitude: user_location[0] - MARKER_DIFF_MINIMIZED,
                  longitude: user_location[1],
                  ...deltas,
                });
                setIsBottomPanelMaximized(false);
              } else {
                mapRef.current?.animateToRegion({
                  latitude: user_location[0] - MARKER_DIFF_MAXIMIZED,
                  longitude: user_location[1],
                  ...deltas,
                });
                setIsBottomPanelMaximized(true);
              }
            }}
          >
            <MaterialIcons
              name={
                isBottomPanelMaximized
                  ? "keyboard-arrow-down"
                  : "keyboard-arrow-up"
              }
              size={24}
              color="white"
            />
          </TouchableOpacity>
          {
            <TouchableOpacity
              style={styles.bottom_recenter_button}
              activeOpacity={0.7}
              onPress={() => {
                mapRef.current?.animateToRegion({
                  latitude:
                    user_location[0] -
                    (isBottomPanelMaximized
                      ? MARKER_DIFF_MAXIMIZED
                      : MARKER_DIFF_MINIMIZED),
                  longitude: user_location[1],
                  ...deltas,
                });
              }}
            >
              <MaterialIcons name="my-location" size={24} color="white" />
            </TouchableOpacity>
          }
        </View>
        <View
          style={{
            ...styles.bottom_panel,
            height: isBottomPanelMaximized
              ? BOTTOM_PANEL_HEIGHT_MAXIMIZED
              : BOTTOM_PANEL_HEIGHT_MINIMIZED,
          }}
        >
          <Text style={{ color: "white", fontSize: 20, fontWeight: "700" }}>
            Vous êtes connecté.e
          </Text>
          <View
            style={{
              flexDirection: "row",
              marginTop: 4,
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <MaterialIcons
              name={
                locationPermission?.status === "granted"
                  ? "location-on"
                  : "location-disabled"
              }
              size={16}
              color="white"
            />
            <Text
              style={{
                color: "white",
                fontSize: 14,
                marginLeft: 6,
                marginRight: 6,
              }}
            >
              Votre localisation est{" "}
              {locationPermission?.status === "granted"
                ? "activée"
                : "désactivée"}
            </Text>
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor:
                  locationPermission?.status === "granted" ? "green" : "red",
              }}
            ></View>
          </View>

          <FlatList
            refreshControl={
              <RefreshControl
                refreshing={isOrdersLoading}
                onRefresh={refetchOrders}
                colors={["#fff"]} // set the color to white
                tintColor={"#fff"} // set the tint color to white
              />
            }
            data={orders}
            renderItem={({ item, index }) => (
              <OrderListItem {...{ item, index }} />
            )}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={OrderListHeader}
            ListEmptyComponent={() => (
              <View
                style={{
                  flex: 1,
                  height: 200,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "white" }}>
                  Aucune commande pour le moment
                </Text>
              </View>
            )}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },

  bottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    alignItems: "flex-end",
    width: "100%",
    flexDirection: "column",
    flex: 1,
  },

  bottom_panel: {
    width: "100%",
    backgroundColor: "black",
    height: BOTTOM_PANEL_HEIGHT_MINIMIZED,
    flexDirection: "column",
    padding: 16,
    color: "white",
  },

  bottom_recenter_button: {
    backgroundColor: "black",
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  bottom_maximize_button: {
    backgroundColor: "black",
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});
