import { useNavigation } from "expo-router";
import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { ProgressStep, ProgressSteps } from "react-native-progress-steps";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/ui/header";

export default function Index() {
  const [activeStep, setActiveStep] = React.useState(1);
  useEffect(() => {
    setActiveStep(1);
  }, []);

  const { goBack, navigate } = useNavigation() as {
    navigate: (href: string, params?: any) => void;
    goBack: () => void;
  };

  const progressStepsStyle = {
    activeStepIconBorderColor: "#008D5E",
    activeLabelColor: "black",
    activeStepNumColor: "white",
    activeStepIconColor: "#008D5E",
    completedStepIconColor: "#008D5E",
    completedProgressBarColor: "#008D5E",
    completedCheckColor: "white",
  };

  const nextStepStyle = {};

  return (
    <View className="relative flex flex-col justify-between w-screen h-screen p-6 pb-16 bg-white">
      <View className="absolute bottom-0 left-0 w-screen bg-black h-28" />
      <SafeAreaView className="flex flex-col w-full h-full gap-4">
        <View className="w-full">
          <AppHeader />
        </View>

        <ProgressSteps {...progressStepsStyle} activeStep={activeStep}>
          <ProgressStep label="RÉCAP."></ProgressStep>
          <ProgressStep
            label="RÉCUP."
            onPrevious={() => {
              navigate("(app)", { screen: "basket/index" });
            }}
          >
            <View style={{ alignItems: "center" }}>
              <Text>This is the content within step 2!</Text>
            </View>
          </ProgressStep>
          <ProgressStep label="PAIEMENT">
            <View style={{ alignItems: "center" }}>
              <Text>This is the content within step 3!</Text>
            </View>
          </ProgressStep>
        </ProgressSteps>

        <View className="absolute bottom-0">
          <View className="flex flex-row w-full space-x-4">
            <View className="">
              <Button onPress={() => goBack()} icon="home" type="secondary" />
            </View>
            <View className="grow">
              <Button icon="arrow-right" onPress={() => console.log("next step")} title="Étape suivante" />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
