import { MaterialCommunityIcons } from "@expo/vector-icons";
import classNames from "classnames";
import { useNavigation } from "expo-router";
import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export const BackButton = ({ className }: { className?: string }) => {
  const { goBack } = useNavigation();
  return (
    <View className="absolute z-40 bottom-12 left-6">
      <TouchableOpacity
        className={classNames("flex items-center justify-center w-16 h-16 bg-black", className)}
        onPress={() => goBack()}
      >
        <MaterialCommunityIcons name="arrow-left" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
};
