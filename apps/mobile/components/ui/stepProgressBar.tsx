import { Text, View } from "react-native";

type StepProgressBarProps = {
  steps: string[];
  currentStep: number;
};

export const StepProgressBar = ({ steps, currentStep }: StepProgressBarProps) => {
  return (
    <View className="flex items-center w-full">
      <View className="flex w-full items-center text-blue-600 dark:text-blue-500 after:content-[''] after:w-full after:h-1 after:border-b after:border-blue-100 after:border-4 after:inline-block dark:after:border-blue-800">
        <Text className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full lg:h-12 lg:w-12 dark:bg-blue-800 shrink-0">
          Récap.
        </Text>
      </View>
      <View className="flex w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-100 after:border-4 after:inline-block dark:after:border-gray-700">
        <Text className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full lg:h-12 lg:w-12 dark:bg-gray-700 shrink-0">
          Récup.
        </Text>
      </View>
      <View className="flex items-center w-full">
        <Text className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full lg:h-12 lg:w-12 dark:bg-gray-700 shrink-0">
          Paiement
        </Text>
      </View>
    </View>
  );
};
