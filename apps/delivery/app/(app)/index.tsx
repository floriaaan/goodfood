import { Header } from "@/components/header";
import { useNative } from "@/hooks/useNative";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView from "react-native-maps";

const { height } = Dimensions.get("window");
const BOTTOM_PANEL_HEIGHT_MINIMIZED = 450;
const BOTTOM_PANEL_HEIGHT_MAXIMIZED = height - 350;

const MARKER_DELTA_MINIMIZED =
  (height - BOTTOM_PANEL_HEIGHT_MINIMIZED) /
  (height + 2 * BOTTOM_PANEL_HEIGHT_MINIMIZED) /
  100; // should be around 0.003
const MARKER_DELTA_MAXIMIZED =
  (height - BOTTOM_PANEL_HEIGHT_MAXIMIZED) / height / 100; // should be around 0.0055


export default function Index() {
  const { location, locationPermission } = useNative();
  const user_location =
    location?.coords.latitude && location?.coords.longitude
      ? [location?.coords.latitude, location?.coords.longitude]
      : [NaN, NaN];

  const mapRef = useRef<MapView | null>(null);

  const [isBottomPanelMaximized, setIsBottomPanelMaximized] = useState(false);

  if (user_location.every(isNaN)) return null;

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: user_location[0] - MARKER_DELTA_MINIMIZED,
          longitude: user_location[1],
          latitudeDelta: 0.009,
          longitudeDelta: 0.009,
        }}
        showsUserLocation
      ></MapView>
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
                  latitude: user_location[0] - MARKER_DELTA_MINIMIZED,
                  longitude: user_location[1],
                  latitudeDelta: 0.009,
                  longitudeDelta: 0.009,
                });
                setIsBottomPanelMaximized(false);
              } else {
                mapRef.current?.animateToRegion({
                  latitude: user_location[0] - MARKER_DELTA_MAXIMIZED,
                  longitude: user_location[1],
                  latitudeDelta: 0.009,
                  longitudeDelta: 0.009,
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
                    (isBottomPanelMaximized ? 0.0055 : 0.003),
                  longitude: user_location[1],
                  latitudeDelta: 0.009,
                  longitudeDelta: 0.009,
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
              ? Dimensions.get("window").height - 250
              : 350,
          }}
        >
          <Text style={{ color: "white", fontSize: 20, fontWeight: "700" }}>
            Vous êtes connecté.e
          </Text>
          <View
            style={{ flexDirection: "row", marginTop: 4, alignItems: "center" }}
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
