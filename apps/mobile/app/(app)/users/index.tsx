import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/ui/header";
import { useAuth } from "@/hooks/useAuth";

const Users = () => {
  const { user, logout } = useAuth();
  return (
    <>
      <View className="relative flex flex-col justify-between w-screen h-screen p-6 pb-16 bg-white">
        <View className="absolute bottom-0 left-0 w-screen bg-black h-28" />
        <View className="absolute left-0 z-50 w-screen p-4 mt-4 bottom-16">
          <Button onPress={logout} title="Se déconnecter" icon="logout" />
        </View>
        <SafeAreaView className="flex flex-col w-full h-full gap-4">
          <View className="w-full">
            <AppHeader />
          </View>
          <View className="w-full">
            <View style={styles.profile}>
              <Image alt="" source={require("@/assets/images/avatar.png")} style={styles.profileAvatar} />
              <View>
                <Text style={styles.profileName}>
                  {user?.firstName} {user?.lastName}
                </Text>
                <Text style={styles.profileHandle}>{user?.email}</Text>
              </View>
            </View>
            <View className="p-4 pb-6 mt-4 bg-neutral-50">
              <Text className="text-lg font-bold">Mon adresse de livraison</Text>
              <Link
                href="(app)/users/change-address"
                className="flex flex-row items-center w-full text-sm text-left text-black "
              >
                <View className="flex flex-row items-center w-full gap-2 ">
                  <MaterialCommunityIcons name="map-marker" size={24} color="black" />
                  <View className="flex flex-col gap-1 grow">
                    <Text className="text-sm text-black">{user?.mainaddress.street}</Text>
                    <Text className="text-xs text-black/60">{`${user?.mainaddress.zipcode}, ${user?.mainaddress.country}`}</Text>
                  </View>
                  <MaterialCommunityIcons name="chevron-right" size={24} color="black" />
                </View>
              </Link>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </>
  );
};

export default Users;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },

  /** Profile */
  profile: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  profileAvatar: {
    width: 60,
    height: 60,
    marginRight: 12,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#292929",
  },
  profileHandle: {
    marginTop: 2,
    fontSize: 16,
    fontWeight: "400",
    color: "#858585",
  },
});
