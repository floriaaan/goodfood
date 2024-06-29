import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export const CategoryHeader = ({ title, subtitle, href }: { title: string; subtitle: string; href: string }) => {
  const { navigate } = useNavigation() as {
    navigate: (href: string, params?: any) => void;
  };
  return (
    <TouchableOpacity
      className="flex flex-row items-center justify-between w-full"
      onPress={() =>
        navigate(`(app)`, {
          screen: "restaurants/index",
        })
      }
    >
      <View className="flex flex-col">
        <Text className="text-xl font-bold text-white">{title}</Text>
        <Text className="text-xs text-white">{subtitle}</Text>
      </View>
      <MaterialCommunityIcons name="arrow-right" size={24} color="white" />
    </TouchableOpacity>
  );
};
