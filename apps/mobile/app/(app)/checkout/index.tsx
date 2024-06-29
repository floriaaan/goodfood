import { useNavigation } from "expo-router";
import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { StepIndicator } from "@/components/basket/step-indicator";
import CheckoutScreen from "@/components/checkout/CheckoutScreen";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/ui/header";

export default function Index() {
  const { navigate } = useNavigation() as {
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
          <StepIndicator steps={["RÉCAP.", "RÉCUP.", "PAIEMENT"]} currentStep={3} />
        </View>
        <View className="flex flex-col w-full gap-2">
          <CheckoutScreen />
        </View>
        <View className="absolute bottom-0">
          <View className="flex flex-row w-full space-x-4">
            <View className="">
              <Button
                onPress={() => navigate("(app)", { screen: "checkout/selection/index" })}
                icon="chevron-left"
                type="secondary"
              />
            </View>
            <View className="grow">
              <Button onPress={() => navigate("(app)/home")} type="secondary" title="Retour à l'accueil" />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
