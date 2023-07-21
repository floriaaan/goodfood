import { Text, View } from "react-native";

export const UserLocation = () => {
  return (
    <View className="flex flex-col">
      <Text className="text-sm font-bold text-black">
        24 rue Émile Zola - 76100 Rouen
      </Text>
      <Text className="text-xs text-black/60">mercredi 18 janvier - 12:15 - 12:35</Text>
    </View>
  );
};
