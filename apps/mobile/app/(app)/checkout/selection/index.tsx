import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { useNavigation } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { StepIndicator } from "@/components/basket/step-indicator";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/ui/header";

export default function Index() {
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
        <View className="w-full ">
          <StepIndicator steps={["RÉCAP.", "RÉCUP.", "PAIEMENT"]} currentStep={2} />
        </View>
        <View className="flex flex-col gap-2">
          <Text className="text-lg font-bold">Méthode de livraison</Text>
          <View className="flex flex-row items-center h-16 px-6 text-sm font-medium border opacity-50">
            <Icon name="circle-outline" size={18} />
            <Text className="pl-1 text-sm">Paiement sur place</Text>
          </View>
          <TouchableOpacity
            className="flex flex-row items-center h-16 px-6 text-sm border cursor-pointer "
            onPress={() => navigate(`(app)`, { screen: "checkout/index" })}
          >
            <Icon name="check-circle-outline" size={18} />
            <Text className="pl-1 text-sm font-bold">Livraison et paiement par carte</Text>
          </TouchableOpacity>
        </View>
        <View className="absolute bottom-0">
          <View className="flex flex-row w-full space-x-4">
            <View className="">
              <Button
                onPress={() => navigate("(app)", { screen: "basket/index" })}
                icon="chevron-left"
                type="secondary"
              />
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
