import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { useQuery } from "@tanstack/react-query";
import { useNavigation } from "expo-router";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CheckoutScreen from "@/components/checkout/CheckoutScreen";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/ui/header";
import { useAuth } from "@/hooks/useAuth";
import { fetchAPI } from "@/lib/fetchAPI";
import { Payment } from "@/types/payment";

export default function Index() {
  const { session } = useAuth();

  const { goBack, navigate } = useNavigation() as {
    navigate: (href: string, params?: any) => void;
    goBack: () => void;
  };

  return (
    <View className="relative flex flex-col justify-between w-screen h-screen p-6 pb-16 bg-white">
      <View className="absolute bottom-0 left-0 w-screen bg-black h-28" />
      <SafeAreaView className="flex flex-col w-full h-full gap-4">
        <View className="w-full">
          <AppHeader />
        </View>
        <View className="flex flex-col gap-2">
          <Text className="font-bold text-lg">Méthode de livraison</Text>
          <View className="flex flex-row items-center h-16 border px-6 opacity-50 text-sm font-medium">
            <Icon name="circle-outline" size={18} />
            <Text className="text-sm pl-1">Paiement sur place</Text>
          </View>
          <TouchableOpacity
            className="flex items-center flex-row h-16 border px-6 text-sm  cursor-pointer "
            onPress={() => navigate(`(app)`, { screen: "checkout/index" })}
          >
            <Icon name="check-circle-outline" size={18} />
            <Text className="font-bold text-sm pl-1">Livraison et paiement par carte</Text>
          </TouchableOpacity>
        </View>
        <View className="absolute bottom-0">
          <View className="flex flex-row w-full space-x-4">
            <View className="">
              <Button onPress={() => goBack()} icon="home" type="secondary" />
            </View>
            <View className="grow">
              <Button
                icon="arrow-right"
                onPress={() => navigate(`(app)`, { screen: "checkout/index" })}
                title="Étape suivante"
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
