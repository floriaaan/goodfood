import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

export const CategoryHeader = ({ title, subtitle, href }: { title: string; subtitle: string; href: string }) => {
  return (
    <View className="flex flex-row items-center justify-between w-full">
      <View className="flex flex-col">
        <Text className="text-xl font-bold text-white">{title}</Text>
        <Text className="text-xs text-white">{subtitle}</Text>
      </View>
      <TouchableOpacity className="flex flex-row items-center justify-center w-12 h-12">
        <MaterialCommunityIcons name="arrow-right" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};
