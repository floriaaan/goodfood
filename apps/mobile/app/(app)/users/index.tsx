import { useAuth } from "@/hooks/useAuth";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppHeader } from "@/components/ui/header";
import React from "react";

const Users = () => {
  const { user } = useAuth();
  return (
    <>
      <View className="relative flex flex-col justify-between w-screen h-screen p-6 pb-16 bg-white">
        <View className="absolute bottom-0 left-0 w-screen bg-black h-28" />
        <SafeAreaView className="flex flex-col w-full h-full gap-4">
          <View className="w-full">
            <AppHeader />
          </View>
          <View className="flex flex-col gap-4">
            <Text className="text-3xl font-bold">Mes informations</Text>
            <View className="inline-flex gap-x-4 bg-gray-100 p-2">
              <View className="flex flex-col gap-4">
                <Image className="w-10 h-10 ml-2 bg-white" source={require("@/assets/images/avatar.png")} />
                {/* TODO: replace by the real avatar */}
                <View>
                  <Text className="font-ultrabold text-2xl font-bold">
                    {user?.firstName ?? "Prénom"} {user?.lastName ?? "Nom"}
                  </Text>
                  <Text className="text-neutral-600">{user?.email ?? "Email"}</Text>
                </View>
                <View>
                  <Text className="text-lg font-bold">Adresse</Text>
                  <Text className="text-neutral-600">
                    {user?.mainaddress.street} {user?.mainaddress.zipcode}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </>
  );
};

export default Users;
