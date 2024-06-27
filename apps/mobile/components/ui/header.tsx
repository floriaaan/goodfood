import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link, useNavigation } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Popover from "react-native-popover-view/dist/Popover";

import { UserLocation } from "@/components/user/location";
import { useAuth } from "@/hooks/useAuth";

export const AppHeader = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  if (user)
    return (
      <View key="header" className="flex flex-row items-center justify-between w-full ">
        <TouchableOpacity
          className="flex items-center justify-center w-10 h-10 bg-white"
          onPress={() => {
            // @ts-ignore
            navigation.openDrawer();
          }}
        >
          <MaterialCommunityIcons name="menu" size={32} color="black" />
        </TouchableOpacity>
        <UserLocation />
        <Popover
          from={
            <TouchableOpacity>
              <Image className="w-10 h-10 ml-2 bg-white" source={require("@/assets/images/avatar.png")} />
            </TouchableOpacity>
          }
        >
          <View className="flex flex-col gap-4 p-4 w-96">
            <Link
              href="(app)/users/"
              style={{
                width: "100%",
              }}
            >
              <View className="flex flex-row items-center">
                <MaterialCommunityIcons name="account" size={24} color="black" />
                <Text className="ml-1 text-black">Mon compte</Text>
              </View>
            </Link>
            <Link
              href="(app)/users/change-address"
              style={{
                width: "100%",
              }}
            >
              <View className="flex flex-row items-center">
                <MaterialCommunityIcons name="map-marker" size={24} color="black" />
                <Text className="ml-1 text-black">Adresse de livraison</Text>
              </View>
            </Link>
            <TouchableOpacity
              onPress={() => {
                logout();
              }}
            >
              <View className="flex flex-row items-center">
                <MaterialCommunityIcons name="logout" size={24} color="black" />
                <Text className="ml-1 text-black">Se déconnecter</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Popover>
      </View>
    );
  return (
    <View>
      <Text>Header</Text>
    </View>
  );
};
